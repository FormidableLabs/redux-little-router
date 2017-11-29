/* eslint-disable no-magic-numbers, react/no-multi-comp */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import chunk from 'lodash.chunk';
import { Link, Fragment, push } from '../../src';
import styles from './demo.css';

const COLUMN_COUNT = 2;

const columnize = (array, columns) => {
  const remainder = array.length % columns;
  const chunkSize = Math.floor(array.length / columns);
  const firstChunkSize = chunkSize + remainder;
  const firstChunk = array.slice(0, firstChunkSize);
  return [firstChunk].concat(
    chunk(array.slice(firstChunkSize, array.length), chunkSize)
  );
};

const Gallery = ({ columns, images = [], ...rest }) =>
  <div className={styles.gallery} {...rest}>
    {columnize(images, columns).map((column, index) =>
      <div key={index} className={styles.column}>
        {column.map((image, imageIndex) =>
          <img key={imageIndex} className={styles.image} src={image} />
        )}
      </div>
    )}
  </div>;

Gallery.propTypes = {
  columns: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.string)
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { term: '' };
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleTermChange(e) {
    e.preventDefault();
    this.setState({ term: e.target.value });
  }

  handleSearchClick(e) {
    e.preventDefault();
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div>
        <input value={this.state.term} onChange={this.handleTermChange} />
        <button onClick={this.handleSearchClick}>Search!</button>
      </div>
    );
  }
}

SearchBar.propTypes = {
  onSearch: PropTypes.func
};

// eslint-disable-next-line react/no-multi-comp
const Demo = ({ location, goToRoute }) => {
  const demoRoutes = ['/cheese', '/cat', '/dog', '/hipster', '/search-param', '/search-query'];
  return (
    <div className={styles.container}>
      <Fragment forRoute="/" className={styles.container}>
        <div>
          <h1 className={styles.tagline}>
            <span className={styles.secondary}>A Compendium of</span>
            <br />
            <span className={styles.primary}>Ipsums and GIFs</span>
          </h1>

          <div className={styles.nav}>
            <Link href={{ pathname: '/cheese', query: { is: 'cheese' } }}>
              Cheese
            </Link>
            <Link href="/dog">Dog</Link>
            <Link href="/cat?is=cat">Cat</Link>
            <Link href="/hipster">Hipster</Link>
            <Link
              href="/nonexistent"
              activeProps={{
                style: {
                  backgroundColor: '#e32636'
                }
              }}
            >
              My Design Skills
            </Link>
            <Link href="/search-param">Search Param</Link>
            <Link href="/search-query">Search Query</Link>
          </div>

          <div className={styles.panes}>
            {demoRoutes.map(route =>
              <Fragment key={route} forRoute={route}>
                <div>
                  <p>
                    {location.result && location.result.text}
                  </p>
                  <Gallery
                    images={location.result && location.result.images}
                    columns={COLUMN_COUNT}
                  />
                </div>
              </Fragment>
            )}

            <Fragment forRoute="/search-param">
              <div>
                {location.params && location.params.term && (<p>{location.params.term}</p>)}
                <SearchBar onSearch={(term) => goToRoute(`/search-param/${term}`)} />
              </div>
            </Fragment>

            <Fragment forRoute="/search-query">
              <div>
                {location.query.term && (<p>Your query: {location.query.term}</p>)}
                <SearchBar onSearch={(term) => goToRoute({ pathname: '/search-query', query: { term } })} />
              </div>
            </Fragment>
          </div>

          <Fragment forRoute="/">
            <p>Pickum ipsum!</p>
          </Fragment>

          <Fragment forNoMatch>
            <div>
              <h2>FOUR O'FOUR</h2>
              <p>Looks like you found something that doesn't exist!</p>
              <img
                className={styles.noMatchImage}
                src="http://i1.kym-cdn.com/photos/images/original/001/018/866/e44.png"
              />
            </div>
          </Fragment>
        </div>
      </Fragment>
    </div>
  );
};

Demo.propTypes = {
  goToRoute: PropTypes.func,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  location: state.router
});

const mapDispatchToProps = dispatch => ({
  goToRoute: (route) => dispatch(push(route))
});

export default connect(mapStateToProps, mapDispatchToProps)(Demo);
