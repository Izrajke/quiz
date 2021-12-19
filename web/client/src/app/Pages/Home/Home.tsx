import { useNavigate } from 'react-router';
import { useStore } from 'store';

export const Home = () => {
  const { app } = useStore();
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(`/room/${app.roomId}`);
  };
  return <button onClick={clickHandler}>Создать комнату</button>;
};
