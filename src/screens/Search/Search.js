import React, { Component } from 'react';
import { generateTitleTag } from '../../services/helpers';
import { Helmet } from 'react-helmet';
import { ROUTES } from '../../services/global-vars';
import { loadDataLayer } from '../../services/google-tag-manager';
import Search from '../../components/Search/Search';

class ScreensSearch extends Component {
  componentDidMount() {
    loadDataLayer({ pageTitle: ROUTES.SEARCH.title });
  }

  render() {
    return (
      <div className="standard-page">
        <Helmet>
          <title>{generateTitleTag('Search')}</title>
        </Helmet>
        <div id="page" className="search">
          <Search />
        </div>
      </div>
    );
  }
}

export default ScreensSearch;