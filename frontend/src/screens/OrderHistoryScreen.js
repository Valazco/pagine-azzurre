import React, { useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useDispatch, useSelector } from 'react-redux'
import { listOrderMine } from '../actions/orderActions'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export default function OrderHistoryScreen(props) {
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders } = orderMineList;
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(listOrderMine());
  }, [dispatch]);
  return (
    <div className="flash">
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>DATE</Th>
              <Th>TOTAL</Th>
              <Th>PAID</Th>
              <Th>DELIVERED</Th>
              <Th>ACTIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.createdAt.substring(0, 10)}</Td>
                <Td>☯{order.totalPriceVal.toFixed(2) + " || €"}</Td>
                <Td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</Td>
                <Td>
                {order.isDelivered
                  ? order.deliveredAt.substring(0, 10)
                  : 'No'}
                </Td>
                <Td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
