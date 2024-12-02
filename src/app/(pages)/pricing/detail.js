"use client";
import { Container, Table, Button } from "react-bootstrap";
import "./pricing.css"; // Ensure you include this CSS file for custom styles

const DetailTable = ({ renderPlan }) => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 font-weight-bold text-dark">
        Our Pricing Plans
      </h2>
      <Table
        bordered
        hover
        variant="light"
        className="text-center custom-table"
      >
        <thead>
          <tr>
            <th className="table-header"></th>
            <th className="table-header">Local Business Plan</th>
            <th className="table-header">Business Powerhouse</th>
            <th className="table-header">Enterprise Plan</th>
            <th className="table-header">For Self Employed</th>
            <th className="table-header">Individual Website</th>
            <th className="table-header">Standard Hosting</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="table-row-label">Price</td>
            <td>$49 / mo</td>
            <td>$69 / mo</td>
            <td>Price based on usage</td>
            <td>$39 / mo</td>
            <td>$20 / mo</td>
            <td>$10 / mo</td>
          </tr>
          <tr>
            <td className="table-row-label">Hosting</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <td className="table-row-label">SSL Certificate</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <td className="table-row-label">Website Builder</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <td className="table-row-label">Generate Articles</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="table-row-label">Generate Images</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="table-row-label">Generate Slides</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="table-row-label">Generate Web Pages</td>
            <td>✔</td>
            <td>Daily</td>
            <td>Multiple Times a Day</td>
            <td>✔</td>
            <td>✔</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="table-row-label">Generate SEO</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="table-row-label">Automated Deployment</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="table-row-label">Page Limit</td>
            <td>100</td>
            <td>200</td>
            <td>Unlimited</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default DetailTable;
