import './App.css';
import { useState,useEffect } from 'react';
import { Button, Modal } from 'antd';
import PrizeModel from './PrizeModel';
import WheelComponent from 'react-wheel-of-prizes'


function App() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [remainingSpins, setRemainingSpins] = useState(0); // Initialize remainingSpins state
  const [prizeName, setPrizeName] = useState('');
  const [purchasedSpins, setPurchasedSpins] = useState(0);
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // const [prizeData, setPrizeData] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleLogin = async () => {
    try {
      // Perform the login request to the API (replace 'http://localhost:5500/login' with the actual login endpoint)
      const response = await fetch('http://localhost:5500/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'malino',
          // You can add the password field here if required: password: 'your_password'
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Assuming the API returns the token in the 'accessToken' field of the response data
      const { accessToken } = data;

      // Store the token in the state and also in local storage (for persistence)
      setToken(accessToken);
      localStorage.setItem('token', accessToken);

      // Update the username in the state (optional)
      setUsername('malino'); // Replace 'malino' with the actual username received from the API

    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // const handleLogout = () => {
  //   // Clear the token from state and local storage
  //   setToken('');
  //   localStorage.removeItem('token');
  //   setUsername('');
  // };
  const handleSpin = async () => {
    try {
      
      // Perform the spin request to the API (replace 'http://localhost:5000/spin' with the actual spin endpoint)
      const response = await fetch('http://localhost:5000/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Spin failed');
      }

      const data = await response.json();

      // Assuming the API returns the 'remainingSpins' and 'prize' fields in the response data
      const { remainingSpins, prize } = data;

      // Update the remainingSpins in the state
      setRemainingSpins(remainingSpins);

      // Display the name inside the prize (assuming prize is an object with a 'name' field)
      if (prize) {
        setPrizeName(prize.name);
      } else {
        setPrizeName('Chúc bạn may mắn lần sau');
      }
      
    } catch (error) {
      console.error('Spin error:', error);
     
    }
  };
  const handlePurchaseSpins = async () => {
    try {
      // Perform the purchaseSpins request to the API (replace 'http://localhost:5000/purchaseSpins' with the actual endpoint)
      const response = await fetch('http://localhost:5000/purchaseSpins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Purchase spins failed');
      }

      const data = await response.json();

      // Assuming the API returns the 'purchasedSpins' and 'remainingSpins' fields in the response data
      const { purchasedSpins, remainingSpins } = data;

      // Update the purchasedSpins and remainingSpins in the state
      setPurchasedSpins(purchasedSpins);
      setRemainingSpins(remainingSpins);
    } catch (error) {
      console.error('Purchase spins error:', error);
    }
  };
  // Function to handle the spinning animation
  // const handleSpinAnimation = () => {
  //   // Calculate the random rotation angle for the spinning wheel
  //   const randomAngle = Math.floor(Math.random() * 360) + 3600;

  //   // Rotate the wheel for a certain duration
  //   const spinningWheel = document.querySelector('.spinning-wheel-container');
  //   spinningWheel.style.transition = 'transform 6s ease-out';
  //   spinningWheel.style.transform = `rotate(${randomAngle}deg)`;

  //   // Reset the wheel rotation after the animation is finished
  //   setTimeout(() => {
  //     spinningWheel.style.transition = 'none';
  //     spinningWheel.style.transform = 'rotate(0deg)';
  //   }, 6000);
  // };
  //vòng quay bắt đầu 

  const segColors = [
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#00FFFF',
    '#C0C0C0',
    '#00FF00',
    '#FF00FF',
    '#66FF99'

   
  ];
  // const [spinning, setSpinning] = useState(false);
  const [winningSegment, setWinningSegment] = useState(null);
  const handonFinished = () => {
    handleSpin();
    
  };
  // const handleSpinClick = () => {
  //   if (!spinning) {
      
  //     // Calculate the random winning segment
  //     const randomIndex = Math.floor(Math.random() * segments.length);
  //     const winningSegment = segments[randomIndex];
  //     setWinningSegment(winningSegment);
  //     setSpinning(true);
  //   }
  // };
  // kết thúc vòng quay 
  //gifts
  const fetchPrizeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/gifts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prize data');
      }

      const data = await response.json();

      // Assuming the API returns the 'gifts' array in the response data
      const gifts = data.gifts;

      // Check if the gifts array exists and is not empty
      if (gifts && gifts.length > 0) {
        // Update the prizes state with the fetched data
        setPrizes(gifts);
      }
    } catch (error) {
      console.error('Error fetching prize:', error);
    }
  };

  useEffect(() => {
    // Fetch prize data initially
    fetchPrizeData();

    // Set up an interval to fetch prize data every 10 seconds (adjust as needed)
    const intervalId = setInterval(() => {
      fetchPrizeData();
    }, 10000); // Fetch every 10 seconds

    // Clean up the interval on component unmount to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []);
  //end gifts

  // gifts data
  const gifts = [
    {
      id: 1,
      name: 'Iphone',
      author: 'Iphone 14 pro max',
    },
    {
      id: 2,
      name: 'Macbook',
      author: 'Macbook 2023 pro ',
    },
    {
      id: 3,
      name: 'Ti Vi',
      author: 'Tivi 80 inch ',
    },
    {
      id: 4,
      name: 'Ipad',
      author: 'ipad 10 pro',
    },
    {
      id: 5,
      name: 'Airpods',
      author: 'Airpods 10 pro',
    },
   
    {
      id: 6,
      name: 'Voucher 20%',
      author: 'Voucher 20%',
    },
   
    
    

  ];
  const segments = gifts.map((gift) => gift.name);
  // const segments = prizes.map((prize) => prize.name);
  

  return (
    <div className='justify-center text-center ' style={{marginTop:"50px"}}>
      <h1 className='text-4xl font-black text-center mt-11 text-red-500 mt-2' >Vòng quay may mắn </h1>
     
      {token ? (
        
        <div className='mt-5'>
           <div >
          <p className=' text-green-800 text-2xl font-bold '>Số lượt của bạn là : {remainingSpins}</p>

        {/* <p className=' text-green-800 text-2xl font-bold '>Phần quà của bạn là: {prizeName}</p> */}
      </div>
      <Button type='primary' className='bg-gray-700 mx-2 mt-2' onClick={handlePurchaseSpins}>
        Thêm vòng quay
      </Button>
      <Button type='primary' className='bg-gray-700 mx-2 mt-2' onClick={showModal} >
          Phần Thưởng !
        </Button>
        {/* <Button type='primary' className='bg-gray-700 mx-2' onClick={handleLogout}>
            Logout
          </Button> */}
     
      <Modal visible={isModalOpen}  onCancel={handleCancel} footer={null}>
     
       <PrizeModel prizes={prizes}  prizeName={prizeName} />
      </Modal>
      
          <div className="flex justify-center items-center ml-96 mt-2">
          <WheelComponent
          segments={segments}
          segColors={segColors}
          winningSegment={winningSegment}
          onFinished={handonFinished}
          primaryColor='black'
          contrastColor='white'
          buttonText="quay nào"
          isOnlyOnce={false}
          size={290}
          upDuration={300}
          downDuration={1000}
          fontFamily='Arial'
          disabled={remainingSpins === 0}
        />

          </div>
        </div>
        
      ) : (
        <Button type='primary' className='bg-gray-700 m-16' onClick={handleLogin}>
          
          Login
        </Button>
      )}
    </div>
  );
}

export default App;
