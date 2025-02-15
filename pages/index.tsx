import React, { useState } from 'react';
import { useUser } from './lib/auth';
import { auth } from './lib/firebaseClient';
import { encrypt } from './lib/crypto';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';



import { Switch } from '@heroui/react';

import CreateServiceStepper from '../components/CreateServiceStepper';

import Login from '../components/Login';
import Signup from '../components/Signup';



import { HoverCard } from '../components/HoverCard';
import { useEffect } from 'react';
import router from 'next/router';
import HelloApp from './helloapp';

const Home = () => {

  

  const [isLogin, setIsLogin] = useState(true);
  const [isSelected, setIsSelected] = React.useState(true);


  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useUser();
  


  const handleCreateServices = async () => {
    if (loading) return; // 이미 요청 중이면 중복 클릭 방지
    setLoading(true);


    try {
      const user = auth.currentUser;

      

      

      const encryptedUserId = encrypt(user.uid);
      const response = await fetch('/api/createservices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: encryptedUserId, name, description }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setName(''); // name 초기화
        setDescription(''); // description 초기화
      } else {
        setMessage(`서버에러: ${data.message}`);
      }
    } catch (error: any) {
      setMessage(`서비스 생성중 에러: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const LoginIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <g fill="blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 14.252V22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"></path></svg>
        </g>
      </svg>
    );
  };

  const SignupIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <g fill="green-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 11H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V13H10V16L15 12L10 8V11Z"></path></svg>
        </g>
      </svg>
    );
  };

  const FirebaseAuthIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        height="1.5rem"
        role="presentation"
        {...props}
      >

      
      <svg viewBox="0 0 1080 127" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M525.467 33.1135H534.292L559.297 98.9338H550.747L544.128 80.8241H515.723L509.104 98.9338H500.555L525.467 33.1135ZM541.463 73.4698L532.729 49.7525L530.064 42.674H529.696L527.122 49.7525L518.389 73.4698H541.463ZM579.296 100.405C573.658 100.405 569.337 98.75 566.334 95.4406C563.392 92.1312 561.922 87.5041 561.922 81.5595V52.0507H569.735V80.3644C569.735 84.8382 570.747 88.117 572.769 90.2007C574.791 92.2844 577.519 93.3262 580.951 93.3262C583.586 93.3262 585.915 92.6215 587.937 91.2119C590.021 89.8023 591.614 87.9638 592.717 85.6962C593.882 83.4287 594.464 81.0386 594.464 78.5259V52.0507H602.278V98.9338H594.832V92.1312H594.464C593.177 94.46 591.124 96.4211 588.305 98.0146C585.486 99.608 582.483 100.405 579.296 100.405ZM630.447 99.6693C628.547 99.6693 626.77 99.3628 625.115 98.75C623.522 98.1371 622.174 97.3098 621.071 96.2679C619.845 95.1035 618.926 93.7552 618.313 92.2231C617.7 90.691 617.394 88.8218 617.394 86.6155V59.1291H609.212V52.0507H617.394V38.8131H625.207V52.0507H636.606V59.1291H625.207V84.685C625.207 87.259 625.698 89.1588 626.678 90.3846C627.843 91.7328 629.528 92.407 631.734 92.407C633.512 92.407 635.227 91.886 636.882 90.8442V98.4742C635.963 98.9032 635.013 99.2096 634.032 99.3935C633.113 99.5773 631.918 99.6693 630.447 99.6693ZM644.705 33.1135H652.519V52.5103L652.151 58.9452H652.519C653.806 56.5551 655.828 54.5633 658.586 52.9699C661.405 51.3765 664.469 50.5798 667.779 50.5798C673.478 50.5798 677.829 52.2652 680.832 55.6358C683.835 58.9452 685.337 63.3578 685.337 68.8734V98.9338H677.523V70.0685C677.523 65.8398 676.45 62.7143 674.305 60.6919C672.16 58.6695 669.372 57.6583 665.94 57.6583C663.489 57.6583 661.221 58.3937 659.137 59.8645C657.115 61.3354 655.491 63.2352 654.265 65.564C653.101 67.8929 652.519 70.3136 652.519 72.8263V98.9338H644.705V33.1135ZM715.623 100.405C711.149 100.405 707.135 99.3322 703.58 97.1872C700.026 95.0422 697.237 92.1005 695.215 88.3621C693.254 84.5625 692.273 80.3031 692.273 75.5842C692.273 71.0491 693.192 66.8817 695.031 63.082C696.931 59.2823 699.597 56.2487 703.029 53.9811C706.461 51.7136 710.444 50.5798 714.979 50.5798C719.576 50.5798 723.559 51.6217 726.93 53.7054C730.3 55.7278 732.874 58.5469 734.652 62.1627C736.49 65.7785 737.41 69.9153 737.41 74.573C737.41 75.4922 737.318 76.289 737.134 76.9631H700.087C700.271 80.5176 701.129 83.5206 702.661 85.972C704.193 88.4234 706.123 90.262 708.452 91.4877C710.842 92.7134 713.324 93.3262 715.898 93.3262C721.904 93.3262 726.531 90.5071 729.78 84.8689L736.398 88.0864C734.376 91.886 731.618 94.889 728.125 97.0953C724.693 99.3015 720.525 100.405 715.623 100.405ZM729.136 70.5281C729.013 68.567 728.462 66.6059 727.481 64.6448C726.501 62.6836 724.938 61.0289 722.793 59.6807C720.709 58.3324 718.074 57.6583 714.887 57.6583C711.21 57.6583 708.085 58.8533 705.511 61.2434C702.998 63.5723 701.343 66.6672 700.547 70.5281H729.136ZM744.716 52.0507H752.162V58.9452H752.53C753.817 56.6164 755.87 54.6553 758.689 53.0619C761.508 51.4072 764.511 50.5798 767.698 50.5798C773.336 50.5798 777.626 52.2345 780.568 55.5439C783.57 58.792 785.072 63.2352 785.072 68.8734V98.9338H777.258V70.0685C777.258 65.7173 776.216 62.5611 774.133 60.5999C772.049 58.6388 769.199 57.6583 765.583 57.6583C763.071 57.6583 760.803 58.363 758.781 59.7726C756.819 61.1822 755.287 63.0514 754.184 65.3802C753.081 67.6477 752.53 70.0379 752.53 72.5506V98.9338H744.716V52.0507ZM810.091 99.6693C808.191 99.6693 806.414 99.3628 804.759 98.75C803.165 98.1371 801.817 97.3098 800.714 96.2679C799.488 95.1035 798.569 93.7552 797.956 92.2231C797.343 90.691 797.037 88.8218 797.037 86.6155V59.1291H788.855V52.0507H797.037V38.8131H804.851V52.0507H816.25V59.1291H804.851V84.685C804.851 87.259 805.341 89.1588 806.322 90.3846C807.486 91.7328 809.171 92.407 811.378 92.407C813.155 92.407 814.871 91.886 816.526 90.8442V98.4742C815.606 98.9032 814.656 99.2096 813.676 99.3935C812.757 99.5773 811.562 99.6693 810.091 99.6693ZM828.945 43.4094C827.412 43.4094 826.095 42.8579 824.992 41.7547C823.888 40.6516 823.337 39.334 823.337 37.8018C823.337 36.2697 823.888 34.9827 824.992 33.9409C826.095 32.8377 827.412 32.2862 828.945 32.2862C830.477 32.2862 831.794 32.8377 832.897 33.9409C834.001 34.9827 834.552 36.2697 834.552 37.8018C834.552 39.334 834.001 40.6516 832.897 41.7547C831.856 42.8579 830.538 43.4094 828.945 43.4094ZM825.084 52.0507H832.805V98.9338H825.084V52.0507ZM864.034 100.405C859.499 100.405 855.423 99.3322 851.807 97.1872C848.191 94.9809 845.372 92.0086 843.35 88.2702C841.327 84.4705 840.316 80.2112 840.316 75.4922C840.316 70.7733 841.327 66.514 843.35 62.7143C845.372 58.9146 848.191 55.9423 851.807 53.7973C855.423 51.6523 859.499 50.5798 864.034 50.5798C869.12 50.5798 873.38 51.7749 876.812 54.165C880.305 56.4938 882.787 59.6194 884.258 63.5416L877.179 66.4833C876.015 63.6029 874.268 61.4273 871.939 59.9564C869.672 58.4243 866.914 57.6583 863.666 57.6583C860.908 57.6583 858.334 58.4243 855.944 59.9564C853.554 61.4273 851.623 63.511 850.153 66.2075C848.743 68.9041 848.038 71.999 848.038 75.4922C848.038 78.9855 848.743 82.0804 850.153 84.777C851.623 87.4735 853.554 89.5878 855.944 91.12C858.334 92.5908 860.908 93.3262 863.666 93.3262C866.975 93.3262 869.825 92.5602 872.215 91.028C874.605 89.4959 876.383 87.3203 877.547 84.5012L884.534 87.4429C882.94 91.3038 880.366 94.4294 876.812 96.8195C873.318 99.2096 869.059 100.405 864.034 100.405ZM905.678 100.405C902.246 100.405 899.182 99.7305 896.486 98.3823C893.789 97.034 891.705 95.1954 890.235 92.8666C888.764 90.4765 888.028 87.7799 888.028 84.777C888.028 79.8129 889.897 75.9519 893.636 73.1941C897.374 70.3749 902.093 68.9654 907.793 68.9654C910.612 68.9654 913.216 69.2718 915.607 69.8847C918.058 70.4975 919.927 71.2023 921.214 71.999V69.1492C921.214 65.656 919.988 62.8675 917.537 60.7838C915.086 58.6388 911.991 57.5663 908.252 57.5663C905.617 57.5663 903.196 58.1485 900.99 59.313C898.784 60.4161 897.037 61.9789 895.75 64.0013L889.867 59.5887C891.705 56.7696 894.218 54.5633 897.405 52.9699C900.653 51.3765 904.238 50.5798 908.16 50.5798C914.534 50.5798 919.529 52.2652 923.145 55.6358C926.822 58.9452 928.66 63.4803 928.66 69.2412V98.9338H921.214V92.2231H920.846C919.498 94.4907 917.476 96.4211 914.779 98.0146C912.083 99.608 909.049 100.405 905.678 100.405ZM906.414 93.5101C909.049 93.5101 911.5 92.836 913.768 91.4877C916.036 90.1394 917.844 88.3315 919.192 86.0639C920.54 83.7964 921.214 81.3143 921.214 78.6178C919.743 77.6372 917.935 76.8405 915.79 76.2277C913.645 75.6148 911.378 75.3084 908.988 75.3084C904.698 75.3084 901.45 76.197 899.243 77.9743C897.098 79.7516 896.026 82.0498 896.026 84.8689C896.026 87.4429 897.007 89.5266 898.968 91.12C900.929 92.7134 903.411 93.5101 906.414 93.5101ZM954.812 99.6693C952.913 99.6693 951.135 99.3628 949.481 98.75C947.887 98.1371 946.539 97.3098 945.436 96.2679C944.21 95.1035 943.291 93.7552 942.678 92.2231C942.065 90.691 941.759 88.8218 941.759 86.6155V59.1291H933.577V52.0507H941.759V38.8131H949.572V52.0507H960.972V59.1291H949.572V84.685C949.572 87.259 950.063 89.1588 951.043 90.3846C952.208 91.7328 953.893 92.407 956.099 92.407C957.877 92.407 959.593 91.886 961.247 90.8442V98.4742C960.328 98.9032 959.378 99.2096 958.398 99.3935C957.478 99.5773 956.283 99.6693 954.812 99.6693ZM973.666 43.4094C972.134 43.4094 970.816 42.8579 969.713 41.7547C968.61 40.6516 968.059 39.334 968.059 37.8018C968.059 36.2697 968.61 34.9827 969.713 33.9409C970.816 32.8377 972.134 32.2862 973.666 32.2862C975.198 32.2862 976.516 32.8377 977.619 33.9409C978.722 34.9827 979.274 36.2697 979.274 37.8018C979.274 39.334 978.722 40.6516 977.619 41.7547C976.577 42.8579 975.26 43.4094 973.666 43.4094ZM969.805 52.0507H977.527V98.9338H969.805V52.0507ZM1009.12 100.405C1004.53 100.405 1000.39 99.3015 996.713 97.0953C993.036 94.889 990.155 91.886 988.072 88.0864C986.049 84.2867 985.038 80.0886 985.038 75.4922C985.038 70.8959 986.049 66.6978 988.072 62.8981C990.155 59.0985 993.036 56.0955 996.713 53.8892C1000.39 51.6829 1004.53 50.5798 1009.12 50.5798C1013.72 50.5798 1017.86 51.6829 1021.53 53.8892C1025.21 56.0955 1028.06 59.0985 1030.08 62.8981C1032.17 66.6978 1033.21 70.8959 1033.21 75.4922C1033.21 80.0886 1032.17 84.2867 1030.08 88.0864C1028.06 91.886 1025.21 94.889 1021.53 97.0953C1017.86 99.3015 1013.72 100.405 1009.12 100.405ZM1009.12 93.3262C1012 93.3262 1014.67 92.6215 1017.12 91.2119C1019.63 89.7411 1021.63 87.6574 1023.1 84.9608C1024.63 82.2643 1025.39 79.1081 1025.39 75.4922C1025.39 71.8764 1024.63 68.7202 1023.1 66.0237C1021.63 63.3271 1019.63 61.2741 1017.12 59.8645C1014.67 58.3937 1012 57.6583 1009.12 57.6583C1006.24 57.6583 1003.55 58.3937 1001.03 59.8645C998.521 61.2741 996.498 63.3271 994.966 66.0237C993.495 68.7202 992.76 71.8764 992.76 75.4922C992.76 79.1081 993.495 82.2643 994.966 84.9608C996.498 87.6574 998.521 89.7411 1001.03 91.2119C1003.55 92.6215 1006.24 93.3262 1009.12 93.3262ZM1039.55 52.0507H1046.99V58.9452H1047.36C1048.65 56.6164 1050.7 54.6553 1053.52 53.0619C1056.34 51.4072 1059.34 50.5798 1062.53 50.5798C1068.17 50.5798 1072.46 52.2345 1075.4 55.5439C1078.4 58.792 1079.9 63.2352 1079.9 68.8734V98.9338H1072.09V70.0685C1072.09 65.7173 1071.05 62.5611 1068.96 60.5999C1066.88 58.6388 1064.03 57.6583 1060.41 57.6583C1057.9 57.6583 1055.63 58.363 1053.61 59.7726C1051.65 61.1822 1050.12 63.0514 1049.01 65.3802C1047.91 67.6477 1047.36 70.0379 1047.36 72.5506V98.9338H1039.55V52.0507Z" fill="#5A5A5A"/>
        <path d="M461.612 99.3987C457.157 99.3987 453.13 98.3615 449.531 96.2869C445.992 94.2124 443.215 91.3447 441.202 87.6838C439.188 83.9618 438.182 79.8128 438.182 75.2366C438.182 70.8435 439.127 66.8165 441.019 63.1555C442.971 59.4336 445.687 56.5048 449.164 54.3693C452.642 52.1727 456.608 51.0745 461.062 51.0745C465.639 51.0745 469.605 52.0812 472.96 54.0947C476.377 56.1082 478.97 58.915 480.74 62.5149C482.509 66.0538 483.394 70.1418 483.394 74.779C483.394 75.3281 483.364 75.8773 483.303 76.4264C483.242 76.9755 483.211 77.2806 483.211 77.3416H448.249C448.554 81.4907 450.049 84.694 452.734 86.9516C455.419 89.2091 458.469 90.3379 461.886 90.3379C467.133 90.3379 471.161 87.8973 473.967 83.0161L482.57 87.1346C480.557 90.8566 477.75 93.8463 474.15 96.1039C470.611 98.3004 466.432 99.3987 461.612 99.3987ZM473.144 69.6537C473.021 68.1893 472.533 66.6944 471.679 65.169C470.825 63.6437 469.483 62.3623 467.652 61.3251C465.883 60.2268 463.656 59.6776 460.971 59.6776C457.981 59.6776 455.388 60.5929 453.191 62.4233C451.056 64.2538 449.592 66.6639 448.798 69.6537H473.144Z" fill="#5A5A5A"/>
        <path d="M416.087 99.3987C410.9 99.3987 406.599 98.2089 403.182 95.8293C399.826 93.3887 397.446 90.3379 396.043 86.677L405.012 82.833C406.05 85.3347 407.544 87.2261 409.497 88.5075C411.51 89.7888 413.707 90.4294 416.087 90.4294C418.588 90.4294 420.632 89.9718 422.219 89.0566C423.805 88.0804 424.598 86.8295 424.598 85.3041C424.598 83.8398 423.958 82.65 422.676 81.7347C421.395 80.7585 419.29 79.9043 416.361 79.1721L410.138 77.7077C406.721 76.9145 403.761 75.4501 401.26 73.3146C398.819 71.118 397.599 68.2808 397.599 64.8029C397.599 60.5929 399.338 57.2675 402.816 54.8269C406.294 52.3253 410.565 51.0745 415.629 51.0745C419.839 51.0745 423.561 51.9592 426.795 53.7286C430.09 55.4981 432.469 58.0607 433.934 61.4166L425.056 65.169C424.202 63.2776 422.89 61.8742 421.12 60.959C419.351 60.0437 417.429 59.5861 415.354 59.5861C413.341 59.5861 411.571 60.0437 410.046 60.959C408.521 61.8132 407.758 62.9725 407.758 64.4369C407.758 65.7182 408.277 66.7554 409.314 67.5486C410.412 68.3418 412.121 69.013 414.439 69.5622L421.212 71.2096C425.788 72.3689 429.205 74.1383 431.462 76.5179C433.72 78.8365 434.849 81.6432 434.849 84.9381C434.849 87.6227 434.025 90.0634 432.378 92.2599C430.791 94.4565 428.564 96.1954 425.696 97.4767C422.89 98.7581 419.686 99.3987 416.087 99.3987Z" fill="#5A5A5A"/>
        <path d="M367.921 99.3987C364.688 99.3987 361.759 98.7581 359.135 97.4767C356.573 96.1344 354.529 94.3039 353.003 91.9853C351.539 89.6057 350.807 86.9211 350.807 83.9313C350.807 79.1721 352.576 75.4196 356.115 72.6739C359.715 69.9282 364.261 68.5554 369.752 68.5554C374.572 68.5554 378.691 69.3791 382.108 71.0265V69.1045C382.108 66.3588 381.009 64.1013 378.813 62.3318C376.677 60.5014 374.084 59.5861 371.033 59.5861C366.396 59.5861 362.674 61.4776 359.867 65.2606L352.18 59.9522C354.315 57.0845 356.969 54.8879 360.142 53.3625C363.376 51.8372 367.006 51.0745 371.033 51.0745C377.684 51.0745 382.809 52.7524 386.409 56.1082C390.07 59.4031 391.901 64.0708 391.901 70.1113V97.9344H382.108V92.3514H381.558C380.094 94.426 378.233 96.1344 375.976 97.4767C373.718 98.7581 371.033 99.3987 367.921 99.3987ZM369.569 91.0701C371.826 91.0701 373.901 90.521 375.792 89.4227C377.745 88.2634 379.27 86.7685 380.369 84.9381C381.528 83.0466 382.108 81.0331 382.108 78.8975C378.874 77.1281 375.426 76.2433 371.765 76.2433C368.41 76.2433 365.786 76.9755 363.894 78.4399C362.003 79.9043 361.057 81.7652 361.057 84.0228C361.057 86.0973 361.881 87.8058 363.528 89.1481C365.237 90.4295 367.25 91.0701 369.569 91.0701Z" fill="#5A5A5A"/>
        <path d="M325.684 99.3983C322.389 99.3983 319.43 98.6966 316.806 97.2933C314.244 95.8899 312.322 94.1205 311.04 91.9849H310.491V97.9339H300.973V32.4033H311.04V52.0808L310.491 58.3959H311.04C312.322 56.3214 314.244 54.5824 316.806 53.1791C319.43 51.7757 322.389 51.0741 325.684 51.0741C329.589 51.0741 333.189 52.1113 336.484 54.1858C339.84 56.2604 342.494 59.1586 344.446 62.8805C346.46 66.5415 347.466 70.66 347.466 75.2362C347.466 79.8123 346.46 83.9309 344.446 87.5918C342.494 91.2527 339.84 94.151 336.484 96.2865C333.189 98.361 329.589 99.3983 325.684 99.3983ZM323.945 90.1545C326.325 90.1545 328.521 89.5443 330.535 88.324C332.609 87.1037 334.257 85.3648 335.477 83.1072C336.758 80.7886 337.399 78.1649 337.399 75.2362C337.399 72.3074 336.758 69.7143 335.477 67.4567C334.257 65.1381 332.609 63.3687 330.535 62.1484C328.521 60.9281 326.325 60.3179 323.945 60.3179C321.565 60.3179 319.338 60.9281 317.264 62.1484C315.25 63.3687 313.603 65.1076 312.322 67.3652C311.101 69.6228 310.491 72.2464 310.491 75.2362C310.491 78.2259 311.101 80.8496 312.322 83.1072C313.603 85.3648 315.25 87.1037 317.264 88.324C319.338 89.5443 321.565 90.1545 323.945 90.1545Z" fill="#5A5A5A"/>
        <path d="M273.192 99.3988C268.738 99.3988 264.711 98.3616 261.111 96.2871C257.572 94.2125 254.795 91.3448 252.782 87.6839C250.768 83.9619 249.762 79.8129 249.762 75.2367C249.762 70.8436 250.707 66.8166 252.599 63.1556C254.551 59.4337 257.267 56.505 260.745 54.3694C264.222 52.1729 268.188 51.0746 272.643 51.0746C277.219 51.0746 281.185 52.0813 284.541 54.0949C287.957 56.1084 290.551 58.9151 292.32 62.515C294.089 66.0539 294.974 70.1419 294.974 74.7791C294.974 75.3282 294.944 75.8774 294.883 76.4265C294.822 76.9757 294.791 77.2807 294.791 77.3418H259.829C260.134 81.4908 261.629 84.6941 264.314 86.9517C266.999 89.2093 270.049 90.338 273.466 90.338C278.714 90.338 282.741 87.8974 285.547 83.0162L294.15 87.1347C292.137 90.8567 289.33 93.8464 285.73 96.104C282.191 98.3006 278.012 99.3988 273.192 99.3988ZM284.724 69.6538C284.602 68.1894 284.113 66.6945 283.259 65.1692C282.405 63.6438 281.063 62.3624 279.232 61.3252C277.463 60.2269 275.236 59.6778 272.551 59.6778C269.561 59.6778 266.968 60.593 264.772 62.4235C262.636 64.2539 261.172 66.664 260.378 69.6538H284.724Z" fill="#5A5A5A"/>
        <path d="M221.822 52.5389H231.341V59.3116H231.89C232.866 56.9931 234.636 55.0711 237.198 53.5457C239.761 51.9593 242.384 51.1661 245.069 51.1661C247.266 51.1661 249.066 51.4712 250.469 52.0813V62.6065C248.395 61.5692 246.076 61.0506 243.513 61.0506C240.218 61.0506 237.442 62.3319 235.185 64.8946C232.988 67.3962 231.89 70.4775 231.89 74.1384V97.9344H221.822V52.5389Z" fill="#5A5A5A"/>
        <path d="M207.452 44.8506C205.561 44.8506 203.944 44.2099 202.602 42.9286C201.32 41.5863 200.68 39.9694 200.68 38.0779C200.68 36.1864 201.32 34.6 202.602 33.3187C203.944 31.9763 205.561 31.3052 207.452 31.3052C209.344 31.3052 210.93 31.9763 212.212 33.3187C213.554 34.6 214.225 36.1864 214.225 38.0779C214.225 39.9694 213.554 41.5863 212.212 42.9286C210.93 44.2099 209.344 44.8506 207.452 44.8506ZM202.419 52.5386H212.486V97.9341H202.419V52.5386Z" fill="#5A5A5A"/>
        <path d="M156.562 32.4034H196.375V42.1964H166.813V61.0502H193.446V70.7517H166.813V97.9341H156.562V32.4034Z" fill="#5A5A5A"/>
        <path d="M31.6581 118.1C36.7104 120.133 42.1915 121.34 47.9467 121.541C55.7355 121.813 63.1422 120.202 69.7635 117.143C61.8234 114.024 54.6322 109.461 48.4949 103.79C44.5166 110.159 38.6325 115.19 31.6581 118.1Z" fill="#FF9100"/>
        <path d="M48.4923 103.791C34.4827 90.8342 25.9838 72.0806 26.7021 51.5112C26.7254 50.8433 26.7607 50.1757 26.8019 49.5084C24.2928 48.8595 21.6734 48.4635 18.9777 48.3694C15.1191 48.2346 11.3823 48.7132 7.85452 49.7066C4.11472 56.2577 1.85787 63.7742 1.57672 71.8254C0.851127 92.6036 13.4253 110.759 31.6556 118.101C38.63 115.192 44.5139 110.167 48.4923 103.791Z" fill="#FFC400"/>
        <path d="M48.4937 103.791C51.7509 98.5782 53.7258 92.4671 53.9557 85.8829C54.5605 68.5638 42.9175 53.6653 26.8033 49.5079C26.762 50.1753 26.7268 50.8428 26.7035 51.5108C25.9852 72.0802 34.484 90.8338 48.4937 103.791Z" fill="#FF9100"/>
        <path d="M52.1543 0.825138C42.9766 8.17757 35.7294 17.8724 31.3447 29.0406C28.8344 35.4376 27.2569 42.309 26.7964 49.5121C42.9106 53.6694 54.5536 68.568 53.9488 85.8871C53.7189 92.4712 51.7382 98.5762 48.4868 103.795C54.6239 109.473 61.8153 114.029 69.7555 117.149C85.693 109.781 97.0006 93.9289 97.6554 75.1785C98.0796 63.0301 93.4121 52.2026 86.8167 43.0633C79.8515 33.3976 52.1543 0.825138 52.1543 0.825138Z" fill="#DD2C00"/>
        <g filter="url(#filter0_d_47_992)">
        <circle cx="100" cy="90.4678" r="30" fill="white"/>
        <path d="M83.5 102.468V98.2678C83.5 97.4178 83.7188 96.6365 84.1562 95.924C84.5938 95.2115 85.175 94.6678 85.9 94.2928C87.45 93.5178 89.025 92.9365 90.625 92.549C92.225 92.1615 93.85 91.9678 95.5 91.9678C97.15 91.9678 98.775 92.1615 100.375 92.549C101.975 92.9365 103.55 93.5178 105.1 94.2928C105.825 94.6678 106.406 95.2115 106.844 95.924C107.281 96.6365 107.5 97.4178 107.5 98.2678V102.468H83.5ZM110.5 102.468V97.9678C110.5 96.8678 110.194 95.8115 109.581 94.799C108.969 93.7865 108.1 92.9178 106.975 92.1928C108.25 92.3428 109.45 92.599 110.575 92.9615C111.7 93.324 112.75 93.7678 113.725 94.2928C114.625 94.7928 115.313 95.349 115.788 95.9615C116.263 96.574 116.5 97.2428 116.5 97.9678V102.468H110.5ZM95.5 90.4678C93.85 90.4678 92.4375 89.8803 91.2625 88.7053C90.0875 87.5303 89.5 86.1178 89.5 84.4678C89.5 82.8178 90.0875 81.4053 91.2625 80.2303C92.4375 79.0553 93.85 78.4678 95.5 78.4678C97.15 78.4678 98.5625 79.0553 99.7375 80.2303C100.913 81.4053 101.5 82.8178 101.5 84.4678C101.5 86.1178 100.913 87.5303 99.7375 88.7053C98.5625 89.8803 97.15 90.4678 95.5 90.4678ZM110.5 84.4678C110.5 86.1178 109.913 87.5303 108.738 88.7053C107.562 89.8803 106.15 90.4678 104.5 90.4678C104.225 90.4678 103.875 90.4365 103.45 90.374C103.025 90.3115 102.675 90.2428 102.4 90.1678C103.075 89.3678 103.594 88.4803 103.956 87.5053C104.319 86.5303 104.5 85.5178 104.5 84.4678C104.5 83.4178 104.319 82.4053 103.956 81.4303C103.594 80.4553 103.075 79.5678 102.4 78.7678C102.75 78.6428 103.1 78.5615 103.45 78.524C103.8 78.4865 104.15 78.4678 104.5 78.4678C106.15 78.4678 107.562 79.0553 108.738 80.2303C109.913 81.4053 110.5 82.8178 110.5 84.4678Z" fill="#1F1F1F"/>
        </g>
        <defs>
        <filter id="filter0_d_47_992" x="68" y="59.1382" width="64" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="0.670408"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_47_992"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_47_992" result="shape"/>
        </filter>
        </defs>
        </svg>
      </svg>
    );
  };

  return(
    <div className="flex flex-col items-center pb-3 h-[calc(100vh-10rem)] bg-gray-300">
    {/* 앱전용 화면크기 <div className="flex flex-col items-center pb-3 h-[calc(100vh-6.5rem)] bg-gray-300"> */}

      <h1 className="font-medium text-4xl text-center mt-8">간단하게 만드는</h1>
      <h1 className="font-medium text-4xl text-center">나만의 디지털 명함</h1>
      <hr className="w-[18rem] border-black mt-1"></hr>
      <div className="mt-[0.5rem]">
        <button type="button" className="focus:outline-none disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-slide-up-animation-modal" data-hs-overlay="#hs-slide-up-animation-modal">
          <i className="ri-id-card-line ri-3x">
            
          </i>
        </button>
      </div>
      
      <div className="text-center mt-[-0.5rem]">
        <i className="ri-arrow-up-long-line ri-2x"></i>
        <p className="font-light text-xl">아이콘을 클릭하면, <strong>내명함의<br />샘플을</strong> 확인할 수 있어요!</p>
      </div>
      
      
      {/* 샘플 3D 명함 모달내용 */}
      <div id="hs-slide-up-animation-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" aria-labelledby="hs-slide-up-animation-modal-label">

        <div className="hs-overlay-open:mt-4 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-14 opacity-0 ease-out transition-all duration-300 pointer-events-none justify-center items-center flex">
          <div className="flex flex-col w-[22rem] bg-white border shadow-sm rounded-xl pointer-events-auto">
            <h3 className="text-lg font-semibold py-2 px-4 border-b">
            미리보는 <strong>{user ? user.displayName : '게스트'}</strong>님의 디지털 명함
            </h3>
            <div>
              <div className="mt-2 mb-3 flex justify-center items-center">
                <HoverCard />
              </div>
              <p className="text-center text-sm mb-1">PC버전에서 마우스를 따라가는 3D 명함을 확인해보세요!</p>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-2 px-3 border-t">
              <button type="button" className="hs-dropup-toggle py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-slide-up-animation-modal">
                미리보기 닫기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[24rem] h-48 mt-[2rem]">
        {user ? 
          <div className="flex flex-col w-[24rem] h-48 items-center">
            {/* 이제 하단에 Stepper형식의 서비스 생성코드 추가필요. */}
            
            <div className="mt-[5rem]">
            <CreateServiceStepper />
            </div>
            

            {/* <input
            type="text"
            placeholder="서비스 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <textarea
              placeholder="서비스 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateServices} disabled={loading}>
              {loading ? '생성 중...' : '생성'}
            </button>
            {message && <p>{message}</p>}
            <br /> */}
        </div>
      :        
        <div className="mb-6">
          <div className="flex flex-col items-center gap-2">
            {/* <div className="text-2xl font-bold">[먼저 로그인이 필요해요!]</div> */}
            
            <Switch
              defaultSelected
              size="md"
              onValueChange={setIsSelected}
              startContent={<SignupIcon />}
              endContent={<LoginIcon />} 
              isSelected={isSelected} >
            </Switch>
            <div className="text-xl font-semibold mt-3">{isSelected ? '로그인' : '회원가입'}</div>
            <div className="text-small text-default-500">{isSelected ? <Login /> : <Signup />}</div>
            
            <hr className="w-[8rem] border-white mt-8 mb-[-0.1rem]"></hr>
            <p className="font-light text-sm text-center">로그인정보는 구글 Firebase에서<br />안전하게 처리하고 저장됩니다.</p>
            <FirebaseAuthIcon />
          </div>
        </div>
      }
    </div>
      {/* <p>(개발전용) User UID: {user ? user.uid : '로그인필요.'}</p> 
      <p>(개발전용) Encrypted User UID: {user ? encrypt(user.uid) : '로그인필요'}</p> */}

      

      
    </div>
  );
};

export default Home;