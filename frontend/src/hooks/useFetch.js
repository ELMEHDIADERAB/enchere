import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
       const fetchData = async () => {
        try {
            const response = await apiService.get(url);
           setData(response.data);
      } catch (err) {
             setError(err);
        } finally {
            setLoading(false);
        }
      };

      fetchData();
    }, [url]);

   const updateData =(newData)=>{
        setData(newData);
    }
  return { data, loading, error, setData:updateData };
};

export default useFetch;