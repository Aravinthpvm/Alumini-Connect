package com.alumniportal.service;

import com.alumniportal.dto.request.AnswerRequest;
import com.alumniportal.dto.request.QuestionRequest;
import com.alumniportal.model.Answer;
import com.alumniportal.model.Question;
import com.alumniportal.model.enums.QuestionCategory;
import com.alumniportal.repository.AnswerRepository;
import com.alumniportal.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public Question createQuestion(String userId, String userType, QuestionRequest request) {
        Question question = new Question();
        question.setAskedBy(userId);
        question.setAskerType(userType);
        question.setTitle(request.getTitle());
        question.setDescription(request.getDescription());
        question.setCategory(QuestionCategory.valueOf(request.getCategory().toUpperCase()));
        question.setTags(request.getTags());
        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Question> getQuestionsByCategory(String category) {
        return questionRepository.findByCategoryOrderByCreatedAtDesc(QuestionCategory.valueOf(category.toUpperCase()));
    }

    public Question getQuestionById(String id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.setViews(question.getViews() + 1);
        return questionRepository.save(question);
    }

    public Answer addAnswer(String questionId, String userId, String userType, AnswerRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = new Answer();
        answer.setQuestionId(questionId);
        answer.setAnsweredBy(userId);
        answer.setAnswererType(userType);
        answer.setContent(request.getContent());

        Answer saved = answerRepository.save(answer);
        question.setAnswers(question.getAnswers() + 1);
        question.setUpdatedAt(LocalDateTime.now());
        questionRepository.save(question);
        return saved;
    }

    public Answer upvoteAnswer(String answerId, String userId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        if (!answer.getUpvotedBy().contains(userId)) {
            answer.getUpvotedBy().add(userId);
            answer.setUpvotes(answer.getUpvotes() + 1);
        }
        return answerRepository.save(answer);
    }

    public Question markBestAnswer(String questionId, String answerId, String userId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getAskedBy().equals(userId)) {
            throw new RuntimeException("Only the question asker can mark the best answer");
        }

        question.setBestAnswerId(answerId);
        question.setSolved(true);
        question.setUpdatedAt(LocalDateTime.now());

        answerRepository.findById(answerId).ifPresent(answer -> {
            answer.setBestAnswer(true);
            answerRepository.save(answer);
        });

        return questionRepository.save(question);
    }

    public List<Answer> getAnswersByQuestion(String questionId) {
        return answerRepository.findByQuestionIdOrderByCreatedAtAsc(questionId);
    }

    public List<Question> getUserQuestions(String userId) {
        return questionRepository.findByAskedBy(userId);
    }
}
