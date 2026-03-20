import React from "react";

export default function PostHeader() {
  return (
    <div className="post-header row center">
      Iscriviti qui:{" "}
      {
        <a className="val_link" href="https://valazco.it">
          valazco.it
        </a>
      }{" "}
      per avere i VAL contributo di emancipazione giornaliero da utilizzare subito
    </div>
  );
}
