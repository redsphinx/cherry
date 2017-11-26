bully_initials = ["😈", "👿"];
victim_initials = ["🙁", "😠"];
bully_transitions = ["😠", "😐", "😶"];

victim_emotions = {
    "angry": "",
    "happy": ""
};

window.bully_state = 1;
window.initial_bully_state = 0;
states = ["state_1", "state_2", "state_3", "state_4"];


// hacky but ok.. 
function switch_state(modifier) {
    bully_state = window.bully_state;
    next_bully_state = bully_state + modifier;
    // if next_bully_state >= 0
    next_victim_state = 5 - next_bully_state;
    victim_state = 5 - bully_state;
    next_bully_smiley = ((next_bully_state === 0) ? bully_initials[window.initial_bully_state] : bully_transitions[next_bully_state - 2]);

    $("#bully_smiley").first().text(next_bully_smiley);

    $("#bully_smiley").first().removeClass(states[bully_state - 1]);
    $("#bully_smiley").first().addClass(states[next_bully_state - 1]);
    $("#victim_smiley").first().removeClass(states[victim_state - 1]);
    $("#victim_smiley").first().addClass(states[next_victim_state - 1]);

    window.bully_state = next_bully_state;
    return [next_bully_state, next_victim_state];
}


