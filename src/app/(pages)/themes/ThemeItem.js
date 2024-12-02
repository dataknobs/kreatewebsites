"use client";
import { useState, useContext } from "react";
import classes from "./ThemeItem.module.css";
import { toast } from "react-toastify";
import Link from "next/link";
import { SessionContext } from "@/app/SessionContext";

const ThemeItem = (props) => {
  const { domains } = useContext(SessionContext);

  const [selectedTheme, setSelectedTheme] = useState("");

  const handleOptionChange = (event) => {
    const themeName = event.target.value;

    if (domains.length === 0) {
      toast.error(
        "First please select the website from My Account page for which theme is to be selected",
      );
      return;
    } else {
      // Always set the selected theme, even if it's the same as before
      setSelectedTheme(themeName);
      props.onThemeSelect(themeName);
    }
  };

  return (
    <li className={`col-md-4 col-sm-6 mb-4 card p-0  ${classes.theme}`}>
      <h3>{props.name}</h3>
      <img
        src={props.images}
        className={classes.image}
        alt={"Its name is:" + props.name}
      />

      <div className={classes.selections}>
        {props.member === true ? (
          <div>
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id={props.id}
              autoComplete="off"
              value={props.name}
              onChange={handleOptionChange}
            />
            <label className="btn btn-outline-primary" htmlFor={props.id}>
              Select Me!
            </label>
          </div>
        ) : (
          <div>
            <Link href="/pricing" className="btn btn-outline-primary">
              Buy Now!
            </Link>
          </div>
        )}
        <a
          href={props.livelink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Live Preview
        </a>
      </div>
    </li>
  );
};

export default ThemeItem;
