import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { chopString } from '../services/helpers';

const FeatureBox = props => {
  const { description, id, imageUrl, label } = props.item;

  return (
    <article className="feature-box">
      <img alt={label} src={imageUrl} />
      <div className="feature-copy">
        <h4>{label}</h4>
        <p>{chopString(description, 15)}</p>
      </div>
      <Link className="button" to={`/items/${id}`}>
        View Work
      </Link>
    </article>
  );
};

FeatureBox.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string,
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    label: PropTypes.string
  })
};

export default FeatureBox;
