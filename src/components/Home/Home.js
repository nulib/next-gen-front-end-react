import React, { useState, useEffect } from "react";
import HeroSection from "../../components/Home/HeroSection";
import HeroSecondarySection from "../../components/Home/HeroSecondarySection";
import PhotoGridSection from "../UI/PhotoGridSection";
import LoadingSpinner from "../UI/LoadingSpinner";
import {
  heroFava,
  heroWPA,
  heroWWII,
  heroWWII_2,
  heroSecondaryData
} from "./hero-banners";
import * as elasticsearchApi from "../../api/elasticsearch-api";
import * as elasticsearchParser from "../../services/elasticsearch-parser";
import * as globalVars from "../../services/global-vars";
import { getRandomInt } from "../../services/helpers";

const Home = () => {
  const numResults = 8;
  const heroRandomNumber = getRandomInt(0, 2);
  const heroItems = [heroFava, heroWPA, heroWWII, heroWWII_2];

  const [galleryCollections, setGalleryCollections] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [keywordCollections, setKeywordCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let promises = [];

    // Combine async network requests
    promises.push(getGalleryItems());
    promises.push(getFeaturedCollections());
    globalVars.HOMEPAGE_COLLECTION_GROUP_KEYWORDS.forEach(keyword =>
      promises.push(getGalleryByKeyword(keyword))
    );

    // Put results on component state
    Promise.all(promises)
      .then(([galleryItems, galleryCollections, ...keywordCollections]) => {
        setGalleryItems(galleryItems);
        setGalleryCollections(galleryCollections);
        setKeywordCollections(keywordCollections);
        setLoading(false);
      })
      .catch(error => console.log("Error grabbing data", error));
  }, []);

  function renderAdditionalGalleries() {
    return globalVars.HOMEPAGE_COLLECTION_GROUP_KEYWORDS.map((keyword, i) => {
      // No values (yet), just return
      if (
        keywordCollections.length === 0 ||
        keywordCollections[i].length === 0
      ) {
        return null;
      }

      return (
        <PhotoGridSection
          key={keyword}
          headline={`${keyword} Collections`}
          items={keywordCollections[i]}
        />
      );
    });
  }

  async function getFeaturedCollections() {
    let response = await elasticsearchApi.getCollectionsByKeyword(
      "Featured",
      8
    );

    const collections = elasticsearchParser.prepPhotoGridItems(
      response,
      globalVars.COLLECTION_MODEL
    );

    return collections;
  }

  /**
   * Get collections by keyword
   */
  async function getGalleryByKeyword(keyword) {
    let response = await elasticsearchApi.getCollectionsByKeyword(keyword);

    const items = elasticsearchParser.prepPhotoGridItems(
      response,
      globalVars.COLLECTION_MODEL
    );

    return items;
  }

  /**
   * Get recently digitized items
   */
  async function getGalleryItems() {
    let response = await elasticsearchApi.getRecentlyDigitizedItems(numResults);
    const items = elasticsearchParser.prepPhotoGridItems(
      response,
      globalVars.IMAGE_MODEL
    );

    return items;
  }

  return (
    <>
      <div className="relative-wrapper homepage-hero-wrapper contain-1440">
        <HeroSection heroData={heroItems[heroRandomNumber]} />
      </div>
      <LoadingSpinner loading={loading} />

      <div className="section">
        <div className="section-top contain-970">
          <h3>Works</h3>
          <p className="subhead">Recently Added and Updated Items</p>
          <ul className="center-list">
            <li>
              <a className="button" href="#">
                View All Works
              </a>
            </li>
            <li>
              <a className="button" href="#">
                Search Works
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="">
        <div className="photo-feature-3-across">
          <article className="photo-feature">
            <a href="#">
              <div className="front">
                <img
                  alt="image description"
                  src="https://iiif.stack.rdc.library.northwestern.edu/iiif/2/5e%2Fd3%2F87%2Ffe%2F-6%2Fea%2F9-%2F46%2Fb6%2F-9%2Fcb%2Ff-%2F18%2F5b%2F96%2F23%2F0d%2F3b/pct:10,10,80,80/480,350/0/default.jpg"
                />
                <div className="text-over-image">
                  <h4>Festival artist fee requisitions</h4>
                  <p className="link">View Work</p>
                </div>
              </div>
              <div className="back">
                <div className="back-text">
                  <h4>Festival artist fee requisitions</h4>
                  <p>Description</p>
                  <p className="link">Go to work</p>
                </div>
              </div>
            </a>
          </article>
          <article className="photo-feature">
            <a href="#">
              <div className="front">
                <img
                  alt="image description"
                  src="https://iiif.stack.rdc.library.northwestern.edu/iiif/2/51%2F0e%2Ff3%2F51%2F-6%2Fcc%2Fc-%2F4d%2Fa0%2F-8%2Fdb%2F0-%2F7a%2Fa9%2Fd4%2F05%2F33%2F2c/pct:10,10,80,80/480,350/0/default.jpg"
                />
                <div className="text-over-image">
                  <h4>
                    11th Annual ASUC Berkeley Folk Music Festival brochure
                  </h4>
                  <p className="link">View Work</p>
                </div>
              </div>
              <div className="back">
                <div className="back-text">
                  <h4>
                    11th Annual ASUC Berkeley Folk Music Festival brochure
                  </h4>
                  <p>Description</p>
                  <p className="link">Go to Site</p>
                </div>
              </div>
            </a>
          </article>
          <article className="photo-feature">
            <a href="#">
              <div className="front">
                <img
                  alt="image description"
                  src="https://iiif.stack.rdc.library.northwestern.edu/iiif/2/4e%2Fc2%2Fcc%2Fcb%2F-7%2F31%2F9-%2F4d%2F03%2F-8%2F2d%2Fc-%2Fcc%2Ff9%2F12%2F04%2Fae%2Fed/pct:10,10,80,80/480,350/0/default.jpg"
                />
                <div className="text-over-image">
                  <h4>Yazlkaya, rock sanctuary</h4>
                  <p className="link">View Work</p>
                </div>
              </div>
              <div className="back">
                <div className="back-text">
                  <h4>Yazlkaya, rock sanctuary</h4>
                  <p>Description</p>
                  <p className="link">Go to Site</p>
                </div>
              </div>
            </a>
          </article>
        </div>
      </div>

      <div className="section">
        <div className="photo-feature-3-across" style={{ marginTop: "0" }}>
          <article className="photo-feature">
            <a href="#">
              <div className="front">
                <img
                  alt="image description"
                  src="https://iiif.stack.rdc.library.northwestern.edu/iiif/2/4e%2Fc2%2Fcc%2Fcb%2F-7%2F31%2F9-%2F4d%2F03%2F-8%2F2d%2Fc-%2Fcc%2Ff9%2F12%2F04%2Fae%2Fed/pct:10,10,80,80/480,350/0/default.jpg"
                />
                <div className="text-over-image">
                  <h4>Yazlkaya, rock sanctuary</h4>
                  <p className="link">View Work</p>
                </div>
              </div>
              <div className="back">
                <div className="back-text">
                  <h4>Yazlkaya, rock sanctuary</h4>
                  <p>Description</p>
                  <p className="link">Go to Site</p>
                </div>
              </div>
            </a>
          </article>
          <article className="photo-feature">
            <a href="#">
              <div className="front">
                <img
                  alt="image description"
                  src="https://iiif.stack.rdc.library.northwestern.edu/iiif/2/5e%2Fd3%2F87%2Ffe%2F-6%2Fea%2F9-%2F46%2Fb6%2F-9%2Fcb%2Ff-%2F18%2F5b%2F96%2F23%2F0d%2F3b/pct:10,10,90,90/480,350/0/default.jpg"
                />
                <div className="text-over-image">
                  <h4>Title</h4>
                  <p className="link">View Work</p>
                </div>
              </div>
              <div className="back">
                <div className="back-text">
                  <h4>Title</h4>
                  <p>Description</p>
                  <p className="link">Go to Site</p>
                </div>
              </div>
            </a>
          </article>

          <article className="photo-feature">
            <a href="#">
              <div className="front">
                <img
                  alt="image description"
                  src="https://iiif.stack.rdc.library.northwestern.edu/iiif/2/51%2F0e%2Ff3%2F51%2F-6%2Fcc%2Fc-%2F4d%2Fa0%2F-8%2Fdb%2F0-%2F7a%2Fa9%2Fd4%2F05%2F33%2F2c/pct:10,10,80,80/480,350/0/default.jpg"
                />
                <div className="text-over-image">
                  <h4>
                    11th Annual ASUC Berkeley Folk Music Festival brochure
                  </h4>
                  <p className="link">View Work</p>
                </div>
              </div>
              <div className="back">
                <div className="back-text">
                  <h4>
                    11th Annual ASUC Berkeley Folk Music Festival brochure
                  </h4>
                  <p>Description</p>
                  <p className="link">Go to Site</p>
                </div>
              </div>
            </a>
          </article>
        </div>
      </div>

      {!loading && (
        <div>
          <PhotoGridSection
            headline="Recently Added and Updated Items"
            linkTo="/search"
            linkToText="View All Items"
            items={galleryItems}
            hideDescriptions={true}
            data-testid="section-recent-items"
          />
          <PhotoGridSection
            headline="Featured Collections"
            linkTo="/collections"
            linkToText="View All Collections"
            items={galleryCollections}
            data-testid="section-featured-collections"
          />
        </div>
      )}
      <div className="contain-1120">
        <HeroSecondarySection heroData={heroSecondaryData} />
        {!loading && renderAdditionalGalleries()}
      </div>
    </>
  );
};

export default Home;
