import { useNavigate } from 'react-router';
import { useStore } from 'store';

import { observer } from 'mobx-react-lite';

import { Paper, Textarea, Button, Divider } from 'components';

import classes from './Home.module.css';

export const Home = observer(() => {
  const { app } = useStore();
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(`/room/${app.roomId}`);
  };

  return (
    <div className={classes.wrapper}>
      <header className={classes.header}>О игре</header>
      <div className={classes.body}>
        <Paper className={classes.chat}>
          <div className={classes.messagesContainer}></div>
          <Textarea
            className={classes.textarea}
            placeholder="Введите сообщение ..."
          />
        </Paper>
        <Paper className={classes.lobbys}>
          <div className={classes.lobbysContainer}></div>
          <Divider className={classes.divider} />
          <Button
            className={classes.button}
            type="primary"
            onClick={clickHandler}
          >
            Создать лобби
          </Button>
        </Paper>
      </div>
    </div>
  );
});
