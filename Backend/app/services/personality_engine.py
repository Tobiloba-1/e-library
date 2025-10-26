# NOTE: simplified logic — adapt per your real quiz mapping
def compute_personality(answers: dict) -> dict:
    """
    answers: dict of question_id -> selected option
    This function should compute a personality type.
    Here we'll use a tiny rule-based approach for demo.
    """
    # Example: tally keywords per answer
    tally = {"thinker": 0, "explorer": 0, "dreamer": 0, "strategist": 0}
    mapping = {
        # question -> {option: personality_key}
        "q1": {"A": "thinker", "B": "explorer"},
        "q2": {"A": "dreamer", "B": "strategist"},
        # add all your questions here...
    }
    for q, ans in answers.items():
        if q in mapping and ans in mapping[q]:
            tally[mapping[q][ans]] += 1

    # choose highest
    personality_key = max(tally, key=lambda k: tally[k])
    label_map = {
        "thinker": "The Thinker",
        "explorer": "The Explorer",
        "dreamer": "The Dreamer",
        "strategist": "The Strategist",
    }
    return {"type": label_map.get(personality_key, "General"), "score": tally}
