import { useState } from 'react';
import SingleSelect from '../select/SingleSelect';
import styles from './SecurityQuestions.module.css';

const SECURITY_QUESTIONS = [
  { value: 'pet_name', label: 'Qual o nome do seu primeiro animal de estimação?' },
  { value: 'birth_city', label: 'Em qual cidade você nasceu?' },
  { value: 'mother_maiden', label: 'Qual o nome de solteira da sua mãe?' },
  { value: 'first_school', label: 'Qual o nome da sua primeira escola?' },
  { value: 'favorite_teacher', label: 'Qual o nome do seu professor favorito?' },
  { value: 'childhood_friend', label: 'Qual o nome do seu melhor amigo de infância?' },
  { value: 'first_car', label: 'Qual foi o modelo do seu primeiro carro?' },
  { value: 'favorite_food', label: 'Qual sua comida favorita na infância?' },
  { value: 'first_job', label: 'Qual foi seu primeiro emprego?' },
  { value: 'dream_destination', label: 'Qual seu destino de viagem dos sonhos?' }
];

const SecurityQuestions = ({ value, onChange }) => {
  const [questions, setQuestions] = useState(value || [{ question: null, answer: '' }]);

  const handleAddQuestion = () => {
    if (questions.length < 3) {
      const newQuestions = [...questions, { question: null, answer: '' }];
      setQuestions(newQuestions);
      onChange(newQuestions);
    }
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    onChange(newQuestions);
  };

  const handleQuestionChange = (index, selectedOption) => {
    const newQuestions = [...questions];
    newQuestions[index].question = selectedOption;
    setQuestions(newQuestions);
    onChange(newQuestions);
  };

  const handleAnswerChange = (index, answer) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = answer;
    setQuestions(newQuestions);
    onChange(newQuestions);
  };

  // Filtra perguntas já selecionadas
  const getAvailableQuestions = (currentIndex) => {
    const selectedValues = questions
      .map((q, i) => i !== currentIndex && q.question?.value)
      .filter(Boolean);
    
    return SECURITY_QUESTIONS.filter(
      q => !selectedValues.includes(q.value)
    );
  };

  return (
    <div className={styles.container}>
      <label className={styles.mainLabel}>
        Perguntas de Segurança <span className={styles.required}>*</span>
      </label>
      <p className={styles.description}>
        Adicione de 1 a 3 perguntas de segurança para recuperação de conta
      </p>

      {questions.map((item, index) => (
        <div key={index} className={styles.questionItem}>
          <div className={styles.questionHeader}>
            <span className={styles.questionNumber}>Pergunta {index + 1}</span>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className={styles.removeButton}
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.questionContent}>
            <div className={styles.selectWrapper}>
              <SingleSelect
                options={getAvailableQuestions(index)}
                value={item.question}
                onChange={(selected) => handleQuestionChange(index, selected)}
                placeholder="Selecione uma pergunta"
              />
            </div>

            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={item.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Sua resposta"
                className={styles.answerInput}
                required
              />
            </div>
          </div>
        </div>
      ))}

      {questions.length < 3 && (
        <button
          type="button"
          onClick={handleAddQuestion}
          className={styles.addButton}
        >
          <span className={styles.addIcon}>+</span>
          Adicionar mais uma pergunta
        </button>
      )}
    </div>
  );
};

export default SecurityQuestions;