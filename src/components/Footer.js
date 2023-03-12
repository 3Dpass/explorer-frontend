const Footer = () => {
  return (
    <footer className="footer">
      <div className="inner-footer">
        <div className="one-footer-section">
          <div className="footer-section-title">Learn More</div>
          <a
            className="one-footer-info"
            href="https://3dpass.org/features.html"
            target="_blank"
            rel="noreferrer"
          >
            3DPass Features
          </a>
          <a
            className="one-footer-info"
            href="https://3dpass.org/community.html"
            target="_blank"
            rel="noreferrer"
          >
            Community
          </a>
          <a
            className="one-footer-info"
            href="https://3dpass.org/3dpass_coin.html"
            target="_blank"
            rel="noreferrer"
          >
            3DPass Coin
          </a>
<a
            className="one-footer-info"
            href="https://prod-api.3dpass.org:4000/api-docs/"
            target="_blank"
            rel="noreferrer"
          >
            Explorer API
          </a>
        </div>
        <div className="one-footer-section">
          <div className="footer-section-title">Follow our News</div>
          <a
            className="one-footer-info"
            href="https://3dpass.org/news.html"
            target="_blank"
            rel="noreferrer"
          >
            Last 3DPass News
          </a>
          <a
            className="one-footer-info"
            href="https://discord.gg/u24WkXcwug"
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
          <a
            className="one-footer-info"
            href="https://t.me/pass3d"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
        </div>
        <div className="one-footer-section">
          <div className="footer-section-title">Keep updated</div>
          <a
            href="https://twitter.com/3dpass1"
            target="_blank"
            rel="noreferrer"
            className="social-icon twitter-icon"
            title="Twitter"
          >
            {" "}
          </a>
          <a
            href="https://github.com/3Dpass/explorer-frontend"
            target="_blank"
            rel="noreferrer"
            className="social-icon github-icon"
            title="GitHub"
          >
            {" "}
          </a>
          <a
            href="mailto:partnership@3dpass.org"
            target="_blank"
            rel="noreferrer"
            className="social-icon email-icon"
            title="Email"
          >
            {" "}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
