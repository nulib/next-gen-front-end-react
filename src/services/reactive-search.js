// ReactiveSearch component Ids
export const COLLECTION_ITEMS_SEARCH_BAR_COMPONENT_ID = "collection-search";
export const GLOBAL_SEARCH_BAR_COMPONENT_ID = "q";
export const DATASEARCH_PLACEHOLDER =
  "Search by title, description, or wildcard (ie. Picass*)";

export const facetValues = {
  COLLECTION: "Collection",
  CONTRIBUTOR: "Contributor",
  CREATOR: "Creator",
  GENRE: "Genre",
  LANGUAGE: "Language",
  LIBRARY_DEPARTMENT: "Library Department",
  LOCATION: "Location",
  RIGHTS_STATEMENT: "Rights Statement",
  STYLE_PERIOD: "Style Period",
  SUBJECT: "Subject",
  TECHNIQUE: "Technique",
  VISIBILITY: "Visibility"
};

// These are common facets used for an Image in ReactivSearch components
export const imageFacets = [
  { name: facetValues.COLLECTION, field: "collection.title.keyword" },
  { name: facetValues.CONTRIBUTOR, field: "contributor.label.keyword" },
  { name: facetValues.CREATOR, field: "creator.label.keyword" },
  { name: facetValues.GENRE, field: "genre.label.keyword" },
  { name: facetValues.LANGUAGE, field: "language.label.keyword" },
  { name: facetValues.LIBRARY_DEPARTMENT, field: "admin_set.title.keyword" },
  { name: facetValues.LOCATION, field: "based_near.label.keyword" },
  {
    name: facetValues.RIGHTS_STATEMENT,
    field: "rights_statement.label.keyword"
  },
  { name: facetValues.STYLE_PERIOD, field: "style_period.label.keyword" },
  { name: facetValues.SUBJECT, field: "subject.label.keyword" },
  { name: facetValues.TECHNIQUE, field: "technique.label.keyword" },
  { name: facetValues.VISIBILITY, field: "visibility.keyword" }
];

// These are common filters used for an Image in ReactivSearch components
export const imageFilters = [
  facetValues.COLLECTION,
  facetValues.CONTRIBUTOR,
  facetValues.CREATOR,
  facetValues.GENRE,
  facetValues.LANGUAGE,
  facetValues.LOCATION,
  "LibraryDepartment",
  "RightsStatement",
  "StylePeriod",
  facetValues.SUBJECT,
  facetValues.TECHNIQUE,
  facetValues.VISIBILITY
];

// For now, this is the ReactiveSearch DataSearch customQuery function,
// which is used to do phrase matching with our current ElasticSearch
// indexing configuration
export const simpleQueryStringQuery = (value = "*") => {
  // Add fuzziness and substring matches to the query value
  let queryValue = value !== "*" ? `${value}~1 | ${value}*` : value;

  return {
    query: {
      simple_query_string: {
        query: queryValue,
        fields: [
          "all_titles^5",
          "description^2",
          "all_subjects^2",
          "full_text"
        ],
        default_operator: "or"
      }
    }
  };
};

export const imagesOnlyDefaultQuery = () => {
  return {
    query: {
      match: {
        "model.name": "Image"
      }
    }
  };
};

export const collectionDefaultQuery = collectionId => {
  return {
    query: {
      bool: {
        must: { match: { "collection.id": collectionId } },
        must_not: { match: { "collection.top_level": false } }
      }
    }
  };
};
