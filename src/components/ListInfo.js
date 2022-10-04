import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "react-toastify";

const ListInfo = ({ title, info, canCopy, isCode, url }) => {
  return (
    <div className="list-info">
      <div className="left-titles">{title}</div>
      <div className="right-info">
        {!isCode && (
          <>
            {!url && <span className="info-span">{info}</span>}
            {url && (
              <Link to={url} className="info-url">
                {info}
              </Link>
            )}
            {canCopy && (
              <CopyToClipboard text={info}>
                <span
                  className="copy"
                  title="Copy to clipboard"
                  onClick={() => {
                    toast("Copied!");
                  }}
                ></span>
              </CopyToClipboard>
            )}
          </>
        )}
        {isCode && (
          <>
            <SyntaxHighlighter language="javascript" style={docco}>
              {info}
            </SyntaxHighlighter>
            <div className="code-btn-holder">
              <CopyToClipboard text={info}>
                <span
                  className="copy"
                  title="Copy to clipboard"
                  onClick={() => {
                    toast("Copied!");
                  }}
                ></span>
              </CopyToClipboard>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListInfo;
