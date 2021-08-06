import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

export default function ProductListScreen(props) {
  const { pageNumber = 1 } = useParams();

  const sellerMode = props.match.path.indexOf('/seller') >= 0;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0)
    window.scrollTo(0, 0)
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(
      listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber })
    );
  }, [
    createdProduct,
    dispatch,
    props.history,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
    pageNumber,
  ]);

  const deleteHandler = (product) => {
    if (window.confirm('Sicuro di voler cancellare l\'annuncio?')) {
      dispatch(deleteProduct(product._id));
    }
  };
  const createHandler = () => {
    dispatch(createProduct());
  };
  return (
    <div>
      {/* <ScrollUp /> */}
      <div className="row flash">
        <h1>Lista di Annunci</h1>
        { !userInfo.hasAd && 
          (
            <MessageBox variant="alert">
              Per contattare un offerente devi diventarlo tu prima. In questa piazza crea un annuncio con un bene o servizio che vorresti barattare. Dove c’è scambio c’è vita.
            </MessageBox>
          )
        }
        <button type="button" className="primary blu" onClick={createHandler}>
          Crea Annuncio
        </button>
      </div>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>IMAGINE</Th>
                <Th>TITOLO / ARGOMENTO</Th>
                <Th>PREZZO</Th>
                <Th>SEZIONE</Th>
                <Th>CATEGORIA</Th>
                <Th>HASHTAG</Th>
                <Th>MODIFICA / CANCELLA</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product._id}>
                  <Td>{product._id}</Td>
                  <Td><img className="minInfo" src={product.image[0]} alt={product.name}/></Td>
                  <Td>{product.name}</Td>
                  <Td>☯ {product.priceVal} <br/>€ {product.priceEuro}</Td>
                  <Td>{ product.section[0].toUpperCase() + product.section.substring(1)}</Td>
                  <Td>{product.category}</Td>
                  <Td>{product.brand}</Td>
                  <Td>
                    <button
                      type="button"
                      className="small"
                      onClick={() =>
                        props.history.push(`/product/${product._id}/edit`)
                      }
                    >
                      Modifica
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => deleteHandler(product)}
                    >
                      Cancella
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
