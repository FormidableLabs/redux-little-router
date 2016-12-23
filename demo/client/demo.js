/* eslint-disable no-magic-numbers */
import React, { PropTypes } from 'react';
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

const Gallery = ({ images, columns, ...rest }) => (
  <div className={styles.gallery} {...rest}>
    {columnize(images, columns).map((column, index) => (
      <div key={index} className={styles.column}>
        {column.map((image, imageIndex) => (
          <img
            key={imageIndex}
            className={styles.image}
            src={image}
          />
        ))}
      </div>
    ))}
  </div>
);

Gallery.propTypes = {
  columns: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.string)
};

// eslint-disable-next-line react/no-multi-comp
const Demo = ({ router }) => {
  const demoRoutes = ['/cheese', '/cat', '/dog', '/hipster'];
  return (
    <div className={styles.container}>
      <Fragment forRoute='/' className={styles.container}>
        <h1 className={styles.tagline}>
          <span className={styles.secondary}>A Compendium of</span>
          <br />
          <span className={styles.primary}>Ipsums and GIFs</span>
        </h1>

        <div className={styles.nav}>
          <Link href={{ pathname: '/cheese', query: { is: 'cheese' } }}>Cheese</Link>
          <Link href='/dog'>Dog</Link>
          <Link href='/cat?is=cat'>Cat</Link>
          <Link href='/hipster'>Hipster</Link>
        </div>

        <div className={styles.panes}>
          {demoRoutes.map(route => (
            <Fragment key={route} forRoute={route}>
              <p>{router.result.text}</p>
              <Gallery
                images={router.result.images}
                columns={COLUMN_COUNT}
              />
            </Fragment>
          ))}
        </div>
      </Fragment>
    </div>
  );
};

Demo.propTypes = {
  router: PropTypes.object
};

export default Demo;
