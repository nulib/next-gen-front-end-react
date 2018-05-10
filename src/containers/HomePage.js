import React, { Component } from 'react';
import HeroSection from '../components/Home/HeroSection';
import CarouselSection from '../components/CarouselSection';
import HeroSecondarySection from '../components/Home/HeroSecondarySection';
import { heroData } from '../api/heros';
import { heroSecondaryData } from '../api/heros';
import { connect } from 'react-redux';
import {
  fetchCarouselItems,
  CAROUSELS,
  handleUpdateBodyClass
} from '../actions';

export class HomePage extends Component {
  componentDidMount() {
    this.handleBodyClassUpdate();

    // Dispatch redux thunk action creators to grab async api data
    this.props.fetchCarouselItems(CAROUSELS.RECENTLY_DIGITIZED_ITEMS);
    //this.props.fetchCarouselItems(CAROUSELS.RECENTLY_DIGITIZED_COLLECTIONS);
    //this.props.fetchCarouselItems(CAROUSELS.PHOTOGRAPHY_COLLECTIONS);
  }

  handleBodyClassUpdate() {
    const page = document.getElementById('page');
    if (page) {
      page.classList.remove('standard-margin');
    }
    this.props.handleUpdateBodyClass('landing-page');
  }

  render() {
    const {
      recentlyDigitizedItems = {},
      recentlyDigitizedCollections = {},
      photographyCollections = {}
    } = this.props.carousels;

    return (
      <div>
        <div className="relative-wrapper homepage-hero-wrapper contain-1440">
          <HeroSection heroData={heroData} />
        </div>
        <section className="standard-page contain-1120">
          <CarouselSection
            sectionTitle="Recently Digitized Items"
            linkTo=""
            items={recentlyDigitizedItems.items}
            slidesPerView={6}
            loading={recentlyDigitizedItems.loading}
            error={recentlyDigitizedItems.error}
          />
          <CarouselSection
            sectionTitle="Recently Digitized and Updated Collections"
            linkTo=""
            items={recentlyDigitizedCollections.items}
            slidesPerView={4}
          />
          <HeroSecondarySection heroData={heroSecondaryData} />
          <CarouselSection
            sectionTitle="Photography Collections"
            linkTo=""
            items={photographyCollections.items}
            slidesPerView={4}
          />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  carousels: state.carousels
});

const mapDispatchToProps = dispatch => ({
  handleUpdateBodyClass: bodyClass =>
    dispatch(handleUpdateBodyClass(bodyClass)),
  fetchCarouselItems: title => dispatch(fetchCarouselItems(title))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
