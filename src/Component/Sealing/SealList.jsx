import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../Paginate/Pagination";
import { getBookingSamplesByBookingId } from "../../utils/getSamplesFromBookingId"; 
import '../Sealing/SealList.css';

function SealList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};
  const [samples, setSamples] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [message, setMessage] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    if (bookingId) {
      fetchSamples(bookingId);
    }
  }, [bookingId]);

  const fetchSamples = async (bookingId) => {
    try {
      const samplesData = await getBookingSamplesByBookingId(bookingId);
      setSamples(samplesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking samples:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(samples.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(samples.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, samples]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % samples.length;
    setItemOffset(newOffset);
  };

  const selectSample = (sample) => {
    navigate('/manager/sealform', { state: { sample, bookingId } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="max-w-full mx-auto p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Danh Sách Mẫu Cần Seal</h4>
        {message && <div className="mb-4 text-green-500">{message}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-4 px-4 text-center align-middle">Mã đơn hàng</th>
                <th className="py-4 px-4 text-center align-middle">Mã mẫu</th>
                <th className="py-4 px-4 text-center align-middle">Tên mẫu</th>
                <th className="py-4 px-4 text-center align-middle">Trạng thái</th>
                <th className="py-4 px-4 text-center align-middle">Chi tiết</th>
                <th className="py-4 px-4 text-center align-middle">Chọn</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentItems.map((sample) => (
                <tr key={sample.sampleId}>
                  <td className="py-4 px-4 text-center align-middle">{sample.bookingId}</td>
                  <td className="py-4 px-4 text-center align-middle">{sample.sampleId}</td>
                  <td className="py-4 px-4 text-center align-middle">{sample.name}</td>
                  <td className="py-4 px-4 text-center align-middle">{sample.status}</td>
                  <td className="py-4 px-4 text-center align-middle">
                    <button
                      onClick={() => navigate(`/samples/${sample.sampleId}`)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Chi tiết
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    <button
                      onClick={() => selectSample(sample)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      </div>
    </div>
  );
}

export default SealList;
