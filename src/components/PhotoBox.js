import React from 'react';
import {Link} from 'react-router-dom';

function PhotoBox(props) {
  const imageUrl = 'http://devbox.library.northwestern.edu' + props.item.thumbnail_path_ss;
  const description = props.item.description_tesim[0].split(' ').splice(0, 40).join(' ') + '...';

  return (
    <article className="photo-box">
      <Link to={props.linkPath} className="photo-box-image-wrapper">
        <img src={imageUrl} alt={props.item.label} />
      </Link>
      <h4>{props.item.label}</h4>
      <p>{description}</p>
      <p className="link">
        <Link to={props.linkPath}>Read more</Link>
      </p>
    </article>
  );
}

export default PhotoBox;