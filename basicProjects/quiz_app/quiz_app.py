import os
import random

def quiz_app():
    questions = [
        {
            'question': 'What is the cutest animal in the world?',
            'options' : ['A- Dog', 'B-Dolphin', 'C-Cat', 'D-Cockroach'],
            'answer' : 'C'
        },
        {
            'question': 'What is a cat favourite food?',
            'options' : ['A- Carrot', 'B-Fish', 'C-Chilli', 'D-Banana'],
            'answer' : 'B'
        },
        {
            'question': 'How much cat would sleep?',
            'options' : ['A- 16hours', 'B-1hours', 'C-5minutes', 'D-24hours'],
            'answer' : 'A'
        }
                ]
    
    score = 0

    for q, a in enumerate(questions, 1):
        print(f'Question {q} : {a['question']}')
        for option in a['options']:
            print(option)
        
        user_ans = input(("What is your answer (A, B, C, D): ")).upper()
        if user_ans == a['answer']:
            print('The answer is correct!')
            score += 1
            print(f'The current score is: {score}/{len(questions)}')


quiz_app()