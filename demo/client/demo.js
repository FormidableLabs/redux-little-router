/* eslint-disable no-magic-numbers */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import chunk from 'lodash.chunk';
import { Link, Fragment } from '../../src';
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

const Gallery = ({ images, columns, ...rest }) =>
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

// eslint-disable-next-line react/no-multi-comp
const Demo = ({ location }) => {
  const demoRoutes = ['/cheese', '/cat', '/dog', '/hipster'];
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
  location: PropTypes.object
};

const mapStateToProps = state => ({
  location: state.router
});
export default connect(mapStateToProps)(Demo);
