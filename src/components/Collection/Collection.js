import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router";
import * as elasticsearchApi from "../../api/elasticsearch-api.js";
import ErrorSection from "../UI/ErrorSection";
import FacetsSidebar from "../UI/FacetsSidebar";
import Breadcrumbs from "../UI/Breadcrumbs/Breadcrumbs";
import LoadingSpinner from "../UI/LoadingSpinner";
import {
  DataSearch,
  ReactiveList,
  SelectedFilters,
} from "@appbaseio/reactivesearch";
import {
  getESDescription,
  getESImagePath,
  getESTitle,
} from "../../services/elasticsearch-parser";
import {
  COLLECTION_ITEMS_SEARCH_BAR_COMPONENT_ID,
  collectionDefaultQuery,
  FACET_SENSORS_RIGHTS_USAGE,
  FACET_SENSORS_LOCATION,
  FACET_SENSORS_CREATOR,
  FACET_SENSORS_DESCRIPTIVE,
  simpleQueryStringQuery,
} from "../../services/reactive-search";
import { useSelector } from "react-redux";
import PhotoBox from "../UI/PhotoBox";
import { ROUTES } from "../../services/global-vars";
import CollectionDescription from "./CollectionDescription";
import FiltersShowHideButton from "../UI/FiltersShowHideButton";

const sortOptions = [
  {
    dataField: "modifiedDate",
    label: "Sort By Modified Date",
    sortBy: "desc",
  },
  {
    dataField: "_score",
    label: "Sort By Relevancy",
    sortBy: "desc",
  },
  {
    dataField: "descriptiveMetadata.title.keyword",
    sortBy: "asc",
    label: "Sort By Title",
  },
];

const Collection = () => {
  const [collection, setCollection] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState();
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    function getApiData() {
      getCollection();
    }

    function getCollection() {
      const { id } = params;
      const request = async () => {
        const response = await elasticsearchApi.getCollection(id);
        let error = null;

        // Handle errors
        // Generic error
        if (response.error) {
          return handle404redirect(response.error.reason);
        }
        // Collection not found
        else if (!response.found) {
          return handle404redirect();
        }
        // Restricted collection
        else if (response._source.visibility === "restricted") {
          error = `The current collection's visibility is restricted.`;
        }
        // Authentication problem
        else if (
          response._source.visibility === "authenticated" &&
          !auth.token
        ) {
          error = `The current collection's visibility is restricted to logged in users.`;
        }

        setCollection(response._source);
        setError(error);
        setLoading(false);
      };
      request();
    }

    function handle404redirect(
      message = "There was an error retrieving the collection, or the collection id does not exist."
    ) {
      history.push(ROUTES.PAGE_NOT_FOUND.path, {
        message,
      });
    }

    setLoading(true);
    getApiData();
  }, [location, params, history, auth.token]);

  // TODO: Move this, and grabbing the collection itself request, up to the screen component
  function createBreadcrumbData(collection) {
    let crumbs = [{ title: "Collections", link: "/collections" }];

    if (collection) {
      crumbs.push({
        title: collection.title || "No title",
        link: "",
      });
    }
    return crumbs;
  }

  const defaultQuery = () => {
    return collection ? collectionDefaultQuery(collection.id) : null;
  };

  const handleDisplaySidebarClick = (e) => {
    e.preventDefault();
    setShowSidebar(!showSidebar);
  };

  /**
   * Helper function to display a custom component to display instead of ReactiveSearch's
   * @param {Object} res - ReactivSearch result object
   */
  function renderItem(res) {
    let item = {
      id: res.id,
      imageUrl: getESImagePath(res),
      label: res.descriptiveMetadata.title,
      type: res.model.name,
    };
    return <PhotoBox key={item.id} item={item} />;
  }

  const breadCrumbData = collection ? createBreadcrumbData(collection) : [];
  const collectionTitle = collection?.title;
  const collectionDescription = collection?.description;

  const allFilters = [
    COLLECTION_ITEMS_SEARCH_BAR_COMPONENT_ID,
    ...FACET_SENSORS_RIGHTS_USAGE.map((facet) => facet.componentId),
    ...FACET_SENSORS_LOCATION.map((facet) => facet.componentId),
    ...FACET_SENSORS_CREATOR.map((facet) => facet.componentId),
    ...FACET_SENSORS_DESCRIPTIVE.map((facet) => facet.componentId),
  ];
  const imageFacetsNoCollection = FACET_SENSORS_RIGHTS_USAGE.filter(
    (facet) => facet.componentId !== "Collection"
  );

  const renderDisplay = () => {
    if (error) {
      return <ErrorSection message={error} />;
    }

    // This check ensures that the new collection's data is freshly rendered on a route id change
    if (loading) {
      return null;
    }
    if (collection) {
      return (
        <div>
          <FacetsSidebar
            facets={imageFacetsNoCollection}
            searchBarComponentId={COLLECTION_ITEMS_SEARCH_BAR_COMPONENT_ID}
            showSidebar={showSidebar}
          />
          <main
            id="main-content"
            className={`content ${!showSidebar ? "extended" : ""}`}
            tabIndex="-1"
          >
            <Breadcrumbs items={breadCrumbData} />

            <h2>{collectionTitle}</h2>

            <div
              data-testid="collection-description"
              style={{ whiteSpace: "pre-line" }}
            >
              <CollectionDescription description={collectionDescription} />
            </div>

            {!loading && (
              <div>
                <DataSearch
                  customQuery={simpleQueryStringQuery}
                  autosuggest={false}
                  className="datasearch web-form"
                  componentId={COLLECTION_ITEMS_SEARCH_BAR_COMPONENT_ID}
                  dataField={["full_text"]}
                  filterLabel="Collections search"
                  innerClass={{
                    input: "searchbox rs-search-input is-fullwidth",
                    list: "suggestionlist",
                  }}
                  queryFormat="or"
                  placeholder="Search within collection"
                  showFilter={true}
                  URLParams={true}
                />

                <SelectedFilters className="rs-selected-filters" />

                <FiltersShowHideButton
                  showSidebar={showSidebar}
                  handleToggleFiltersClick={handleDisplaySidebarClick}
                />

                <ReactiveList
                  componentId="collection-items-results"
                  dataField="descriptiveMetadata.title.keyword"
                  react={{
                    and: [...allFilters],
                  }}
                  defaultQuery={defaultQuery}
                  defaultSortOption={"Sort By Relevancy"}
                  loader={<LoadingSpinner loading={true} />}
                  size={24}
                  pages={10}
                  pagination={true}
                  paginationAt="bottom"
                  renderItem={renderItem}
                  innerClass={{
                    list: "rs-result-list photo-grid four-grid",
                    pagination: "rs-pagination",
                    resultsInfo: "rs-results-info",
                  }}
                  URLParams={true}
                  sortOptions={sortOptions}
                />
              </div>
            )}
          </main>
        </div>
      );
    }
  };

  return (
    <>
      {loading && <LoadingSpinner loading={loading} />}
      {renderDisplay()}
    </>
  );
};

export default Collection;
