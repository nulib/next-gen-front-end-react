import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import * as elasticsearchApi from "../../api/elasticsearch-api.js";
import ErrorSection from "../UI/ErrorSection";
import ItemDetail from "../../components/Work/ItemDetail";
import * as elasticsearchParser from "../../services/elasticsearch-parser";
import * as globalVars from "../../services/global-vars";
import LoadingSpinner from "../UI/LoadingSpinner";
import { shuffleArray } from "../../services/helpers";
import ParentCollections from "../../components/Work/ParentCollections";
import LargeFeature from "../../components/Work/LargeFeature";
import { loadDataLayer } from "../../services/google-tag-manager";
import { loadItemStructuredData } from "../../services/google-structured-data";

export class Work extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adminSetItems: [],
      collectionId: null,
      collectionItems: [],
      error: null,
      id: null,
      item: null,
      loading: true,
      structuredData: null
    };
  }

  async componentDidMount() {
    this.getApiData(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.location) {
      return;
    }
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.getApiData(this.props.match.params.id);
    }
  }

  createBreadcrumbData(item) {
    let crumbs = [{ title: "Items", link: "/search" }];

    if (item) {
      crumbs.push({
        title: elasticsearchParser.getESTitle(item),
        link: ""
      });
    }
    return crumbs;
  }

  async getAdminSets(adminSetId) {
    let adminSetResponse = await elasticsearchApi.getAdminSetItems(
      adminSetId,
      4
    );

    return elasticsearchParser.prepPhotoGridItems(
      adminSetResponse,
      globalVars.IMAGE_MODEL
    );
  }

  async getApiData(id) {
    let item = await this.getItem(id);

    if (!item) {
      return;
    }

    this.populateGTMDataLayer(item);

    let adminSetItems = await this.getAdminSets(item.admin_set.id);
    let collectionItems = await this.getCollections(item);

    this.setState({
      adminSetItems: shuffleArray(adminSetItems),
      collectionItems,
      id,
      item,
      loading: false,
      structuredData: loadItemStructuredData(item, this.props.location.pathname)
    });
  }

  async getCollections(item) {
    const { collection } = item;

    if (collection.length === 0) {
      return [];
    }

    // Pass this property down the tree for linking purposes in Show All Items in Collection
    this.setState({
      collectionId: collection[0].id
    });

    let response = await elasticsearchApi.getCollectionItems(
      collection[0].id,
      4
    );
    let items = elasticsearchParser.prepPhotoGridItems(
      response,
      globalVars.IMAGE_MODEL
    );

    return items;
  }

  async getItem(id) {
    let itemError = "";
    let itemResponse = await elasticsearchApi.getItem(id);
    const { error } = itemResponse;

    // Handle possible errors
    // Generic error
    if (error) {
      if (error.statusCode === 403) {
        itemError = error.reason;
      } else {
        return this.handle404redirect(itemResponse.error.reason);
      }
    }
    // Item not found
    else if (!itemResponse.found) {
      return this.handle404redirect();
    }
    // Restricted item
    else if (itemResponse._source.visibility === "restricted") {
      itemError = `The current item's visibility is restricted.`;
    }
    // Authenticated
    else if (
      itemResponse._source.visibility === "authenticated" &&
      !this.props.auth.token
    ) {
      itemError = `The current item's visibility is restricted to logged in users.`;
    }

    if (itemError) {
      this.setState(
        {
          id: id,
          item: null,
          error: itemError,
          loading: false
        },
        // Return a null value for item, indicating something went south
        () => null
      );
    }

    return itemResponse._source;
  }

  handle404redirect(
    message = "There was an error retrieving the item, or the item id does not exist."
  ) {
    this.props.history.push(globalVars.ROUTES.PAGE_NOT_FOUND.path, {
      message
    });
  }

  populateGTMDataLayer(item) {
    const rightsStatement = item.rights_statement
      ? item.rights_statement.label
      : "";
    const creators = item.creator.map(creator => creator.label);
    const contributors = item.contributor.map(contributor => contributor.label);

    const dataLayer = {
      adminset: item.admin_set.title.map(title => title).join(", "),
      collections: item.collection.map(collection =>
        collection.title.map(title => title).join(", ")
      ),
      creatorsContributors: [...creators, ...contributors],
      pageTitle: elasticsearchParser.getESTitle(item),
      rightsStatement,
      subjects: item.subject.map(subject => subject.label),
      visibility: item.visibility
    };

    loadDataLayer(dataLayer);
  }

  render() {
    const {
      item,
      error,
      collectionId,
      collectionItems,
      adminSetItems,
      loading
    } = this.state;

    if (error) {
      return <ErrorSection message={error} />;
    }
    return (
      <div>
        <LoadingSpinner loading={loading} />

        {!loading && (
          <div>
            <LargeFeature item={item} />
            <ParentCollections
              item={item}
              adminSetItems={adminSetItems}
              collectionItems={collectionItems}
              collectionId={collectionId}
            />
            <ItemDetail item={item} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const withRouterWork = withRouter(Work);
export default connect(mapStateToProps)(withRouterWork);
