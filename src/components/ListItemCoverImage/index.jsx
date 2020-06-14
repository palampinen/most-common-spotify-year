import React from "react";

import "./ListItemCoverImage.scss";

const ListItemCoverImage = ({ src }) => (
  <span className="track__cover" style={{ backgroundImage: `url(${src})` }} />
);

export default ListItemCoverImage;
