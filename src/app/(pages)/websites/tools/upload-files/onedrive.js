import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { PublicClientApplication } from "@azure/msal-browser";
import { v4 as uuid } from "uuid";

const msalConfig = {
  auth: {
    authority: "https://login.microsoftonline.com/consumers",
    clientId: "7dddfa04-a853-47cd-8c92-d9b657992cec",
    // redirectUri: "https://kreateaz2.azurewebsites.net/",
    // redirectUri: "http://localhost:3000/",
    redirectUri: typeof window !== "undefined" ? window.location.href : "",
  },
};

const app = new PublicClientApplication(msalConfig);

function Onedrive({ site, id }) {
  const [pickedFiles, setPickedFiles] = useState([]);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMsalInitialized, setIsMsalInitialized] = useState(false);

  const initializeMsal = async () => {
    try {
      await app.initialize();
      setIsMsalInitialized(true);
    } catch (error) {
      console.error("MSAL initialization error:", error);
    }
  };

  useEffect(() => {
    initializeMsal();
  }, []);

  const getToken = async () => {
    if (!isMsalInitialized) {
      console.error("MSAL instance is not initialized");
      return;
    }

    let accessToken = "";

    const authParams = { scopes: ["OneDrive.ReadWrite"] };

    try {
      const resp = await app.acquireTokenSilent(authParams);
      accessToken = resp.accessToken;
    } catch (e) {
      try {
        const resp = await app.loginPopup(authParams);
        app.setActiveAccount(resp.account);

        if (resp.idToken) {
          const resp2 = await app.acquireTokenSilent(authParams);
          accessToken = resp2.accessToken;
        }
      } catch (loginError) {
        console.error("Login error: ", loginError);
        return;
      }
    }

    return accessToken;
  };

  const launchPicker = async (e) => {
    e.preventDefault();
    initializeMsal();
    const channelId = uuid();
    const baseUrl = "https://onedrive.live.com/picker";
    const params = {
      sdk: "8.0",
      entry: {
        oneDrive: {
          files: {},
        },
      },
      authentication: {},
      messaging: {
        // origin: "https://kreateaz2.azurewebsites.net/",
        origin: window.location.href,
        channelId: channelId,
      },
      typesAndSources: {
        mode: "files",
        pivots: {
          oneDrive: true,
          recent: true,
        },
      },
      commands: {
        pick: {
          select: {
            urls: {
              download: true,
            },
          },
        },
      },
      selection: {
        mode: "multiple",
        enablePersistence: true,
      },
    };

    const authToken = await getToken();
    if (!authToken) {
      console.error("Failed to acquire access token");
      return;
    }

    const queryString = new URLSearchParams({
      filePicker: JSON.stringify(params),
      access_token: authToken,
    });

    const url = `${baseUrl}?${queryString}`;

    let win = window.open(url, "Picker", "width=800,height=600");

    window.addEventListener(
      "message",
      (event) => {
        if (event.source && event.source === win) {
          const message = event.data;

          if (
            message.type === "initialize" &&
            message.channelId === params.messaging.channelId
          ) {
            const port = event.ports[0];
            port.addEventListener("message", (msg) =>
              messageListener(msg, port, win),
            );
            port.start();
            port.postMessage({ type: "activate" });
          }
        }
      },
      { once: true },
    );
  };

  const messageListener = async (message, port, win) => {
    switch (message.data.type) {
      case "command":
        port.postMessage({ type: "acknowledge", id: message.data.id });
        const command = message.data.data;

        switch (command.command) {
          case "authenticate":
            const token = await getToken();
            if (token) {
              port.postMessage({
                type: "result",
                id: message.data.id,
                data: { result: "token", token },
              });
            } else {
              console.error(
                `Could not get auth token for command: ${JSON.stringify(command)}`,
              );
            }
            break;

          case "close":
            win.close();
            break;

          case "pick":
            console.log(command.items);
            try {
              const files = command.items.map((item) => ({
                name: item.name,
                downloadUrl: item["@content.downloadUrl"],
                url: item.webUrl,
              }));
              console.log("picked files: ");
              console.log(files);
              setPickedFiles(files);

              const dUrls = files.map((file) => file.downloadUrl);
              const names = files.map((file) => file.name);
              setDownloadUrls(dUrls);
              setNames(names);

              port.postMessage({
                type: "result",
                id: message.data.id,
                data: { result: "success" },
              });
            } catch (error) {
              console.error("Error processing pick command:", error);
              port.postMessage({
                type: "result",
                id: message.data.id,
                data: { result: "error", error: error.message },
              });
            }

            win.close();
            break;

          default:
            console.warn(`Unsupported command: ${JSON.stringify(command)}`);
            port.postMessage({
              result: "error",
              error: { code: "unsupportedCommand", message: command.command },
              isExpected: true,
            });
            break;
        }
        break;
      default:
        break;
    }
  };

  const submitFiles = async () => {
    setLoading(true);
    const data = {
      id: id,
      download_links: downloadUrls,
      file_names: names,
    };

    try {
      const response = await fetch(
        "https://gdrive-picker-bucket.azurewebsites.net/one_drive",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.data);
        await handleSaveFiles();
        await fetchStoredData();
        setLoading(false);
      } else {
        const errorText = await response.text();
        toast.error("Failed to upload files: " + errorText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting files:", error);
      setLoading(false);
    }
  };

  return (
    <div className="col-12 col-md-4 d-flex align-items-stretch">
      <div className="service-item w-100 d-flex flex-column justify-content-between text-center align-items-center rounded">
        <div className="service-icon btn-square">
          <i className="bi bi-cloud fs-2"></i>
        </div>
        <h5 className="mb-3">Upload from OneDrive</h5>
        <p>
          Connect to your OneDrive account and upload files directly to your
          site.
        </p>
        <Button variant="" className="mt-3" onClick={launchPicker}>
          Connect OneDrive
        </Button>
      </div>

      {pickedFiles.length > 0 && (
        <div className="mt-3">
          <h5>Picked Files:</h5>
          <ListGroup>
            {pickedFiles.map((file, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                {file.name}
                <div className="float-right">
                  <a
                    href={file.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm mr-2"
                  >
                    <FaFileDownload />
                  </a>
                  &nbsp;
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <FaEye />
                  </a>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button
            className="mt-2"
            variant="dark"
            size="md"
            onClick={submitFiles}
          >
            {loading ? "Submitting..." : "Submit Files"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Onedrive;
