CREATE TABLE IF NOT EXISTS categories (
    id serial primary key,
    title varchar not null
);

INSERT INTO categories (id, title) VALUES (1, 'История');
INSERT INTO categories (id, title) VALUES (2, 'Литература');
INSERT INTO categories (id, title) VALUES (3, 'География');
INSERT INTO categories (id, title) VALUES (4, 'Спорт');

CREATE TABLE IF NOT EXISTS packages (
    id serial primary key,
    categoryid int references categories (id),
    title varchar not null,
    data jsonb not null
);

INSERT INTO packages (id, categoryid, title, data) VALUES (1, 1, 'Тестовый пак #1', '{"rangeQuestions": [{"title": "1+1", "answer": 2}, {"title": "1+2", "answer": 3}, {"title": "1+3", "answer": 4}, {"title": "1+4", "answer": 5}, {"title": "1+5", "answer": 6}, {"title": "1+6", "answer": 7}, {"title": "1+7", "answer": 8}, {"title": "1+8", "answer": 9}, {"title": "1+9", "answer": 10}, {"title": "1+10", "answer": 11}, {"title": "1+11", "answer": 12}, {"title": "1+12", "answer": 13}, {"title": "1+13", "answer": 14}, {"title": "1+14", "answer": 15}, {"title": "1+15", "answer": 16}, {"title": "1+16", "answer": 17}, {"title": "1+17", "answer": 18}, {"title": "1+18", "answer": 19}, {"title": "1+19", "answer": 20}, {"title": "1+20", "answer": 21}], "multipleChoiceQuestions": [{"title": "Тест 1", "answer": 0, "options": ["#1", "#2", "#3", "#4"]}, {"title": "Тест 2", "answer": 1, "options": ["#1", "#2", "#3", "#4"]}, {"title": "Тест 3", "answer": 2, "options": ["#1", "#2", "#3", "#4"]}, {"title": "Тест 4", "answer": 3, "options": ["#1", "#2", "#3", "#4"]}, {"title": "Тест 5", "answer": 0, "options": ["#5", "#6", "#7", "#8"]}, {"title": "Тест 6", "answer": 1, "options": ["#5", "#6", "#7", "#8"]}, {"title": "Тест 7", "answer": 2, "options": ["#5", "#6", "#7", "#8"]}, {"title": "Тест 8", "answer": 3, "options": ["#5", "#6", "#7", "#8"]}, {"title": "Тест 9", "answer": 0, "options": ["#9", "#10", "#11", "#12"]}, {"title": "Тест 10", "answer": 1, "options": ["#9", "#10", "#11", "#12"]}, {"title": "Тест 11", "answer": 2, "options": ["#9", "#10", "#11", "#12"]}, {"title": "Тест 12", "answer": 3, "options": ["#9", "#10", "#11", "#12"]}, {"title": "Тест 13", "answer": 0, "options": ["#13", "#14", "#15", "#16"]}, {"title": "Тест 14", "answer": 1, "options": ["#13", "#14", "#15", "#16"]}, {"title": "Тест 15", "answer": 2, "options": ["#13", "#14", "#15", "#16"]}, {"title": "Тест 16", "answer": 3, "options": ["#13", "#14", "#15", "#16"]}, {"title": "Тест 17", "answer": 0, "options": ["#17", "#18", "#19", "#20"]}, {"title": "Тест 18", "answer": 1, "options": ["#17", "#18", "#19", "#20"]}, {"title": "Тест 19", "answer": 2, "options": ["#17", "#18", "#19", "#20"]}, {"title": "Тест 20", "answer": 3, "options": ["#17", "#18", "#19", "#20"]}]}');
