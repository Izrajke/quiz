import { Provider } from 'mobx-react';
import { fireEvent, render, screen } from '@testing-library/react';

import { store } from 'store';

import { PlayingRoomQuestionModal } from './PlayingRoomQuestionModal';
import { SocketResponseType } from 'api';
import type { SocketAnswerData } from 'api';

describe('INTEGRATION: PlayingRoomQuestionModal', () => {
  const mockStore = { ...store };
  const { room } = mockStore;

  afterEach(() => {
    room.useQuestionModal(false);
  });

  beforeEach(() => {
    room.useQuestionModal(true);
  });

  const component = (
    <Provider {...mockStore}>
      <PlayingRoomQuestionModal />
    </Provider>
  );

  test('Компонент первого типа рендерится', () => {
    render(component);

    const question = {
      type: SocketResponseType.firstQuestionType,
      question: {
        title: 'Заголовок вопроса',
        options: {
          '1': 'Вариант 1',
          '2': 'Вариант 2',
          '3': 'Вариант 3',
          '4': 'Вариант 4',
        },
      },
    };

    room.useQuestionModal(true);
    room.setQuestion(question);
    const buttons = screen.getAllByRole('button');

    expect(screen.getByText(/заголовок вопроса/i)).toBeInTheDocument();
    buttons.forEach((button, index) => {
      expect(button.textContent).toBe(`Вариант ${index + 1}`);
    });
    expect(buttons).toMatchSnapshot();
  });

  test('Компонент второго типа рендерится', () => {
    render(component);

    const question = {
      type: SocketResponseType.secondQuestionType,
      question: {
        title: 'Заголовок вопроса',
      },
    };

    room.setQuestion(question);

    const header = screen.getByText(/заголовок вопроса/i);
    const input = screen.getByPlaceholderText(/ваш ответ/i);
    const button = screen.getByRole('button');

    expect(header).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    expect(header).toMatchSnapshot();
    expect(input).toMatchSnapshot();
    expect(button).toMatchSnapshot();
  });

  test('Компонент второго типа переходит в режим ожидания', () => {
    render(component);
    const input = screen.getByPlaceholderText(/ваш ответ/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: '20' } });
    fireEvent.click(button);

    expect(
      screen.getByText(/Ожидание ответа остальных игроков.../i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ваш ответ:/i)).toBeInTheDocument();
    expect(screen.getByText(room.playerAnswer)).toBeInTheDocument();
    expect(room.playerAnswer).toBe('20');

    expect(screen.getByTestId('WaitingAnswerTextContainer')).toMatchSnapshot();
  });

  test('Компонент второго типа показывает результаты', () => {
    render(component);
    const answer: SocketAnswerData = {
      type: SocketResponseType.answerSecondQuestionType,
      answer: {
        value: '100',
      },
      options: [
        {
          color: 'player-2',
          name: 'gogsh',
          value: 21,
          time: 14,
        },
        {
          color: 'player-1',
          name: 'вася',
          value: 1,
          time: 5,
        },
      ],
    };

    room.setAnswer(answer);

    expect(room.answer).toBe(answer.answer.value);
    expect(screen.getByText('gogsh')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.getByText('14 c')).toBeInTheDocument();
    expect(screen.getByText(room.answer)).toBeInTheDocument();

    const answerBars = screen.getAllByTestId('AnswerBar');
    expect(answerBars.length).toBe(2);

    expect(answerBars).toMatchSnapshot();
  });
});
