const spanBagdeValidRound = document.createElement('span');
spanBagdeValidRound.className = "badge rounded-pill bg-success";
spanBagdeValidRound.innerHTML = "Thời gian của hiệp 1"

const spanBagdeInValidRound = document.createElement('span');
spanBagdeInValidRound.className = "badge rounded-pill bg-danger";
spanBagdeInValidRound.innerHTML = "Thời gian của hiệp 1 không hợp lệ"

const spanBagdeInjuryRound = document.createElement('span');
spanBagdeInjuryRound.className = "badge rounded-pill bg-warning text-dark";
spanBagdeInjuryRound.innerHTML = "Thời gian bù giờ của hiệp 1";

// document.getElementById('detail-info-valid-round').innerHTML = "";
document.getElementById('detail-info-valid-round').appendChild(spanBagdeValidRound)

function _prepareDataEditEventMatch(match) {
    // Đội
    const optionTeam1 = document.createElement('option');
    optionTeam1.value = 0;
    optionTeam1.textContent = match.teams[0].team.name;
    state.elements.detailMatchModal.selectTeamTabEvent.appendChild(optionTeam1);
    const optionTeam2 = document.createElement('option');
    optionTeam2.value = 1;
    optionTeam2.textContent = match.teams[1].team.name;
    state.elements.detailMatchModal.selectTeamTabEvent.appendChild(optionTeam2);
    // Cầu thủ
    match.teams[0].team.players.forEach((player) => {
        const optionPlayer = document.createElement('option');
        optionPlayer.value = player.id;
        optionPlayer.textContent = player.name;
        state.elements.detailMatchModal.selectPlayerTabEvent.appendChild(optionPlayer);
    })
    match.teams[1].team.players.forEach((player) => {
        const optionPlayer = document.createElement('option');
        optionPlayer.value = player.id;
        optionPlayer.textContent = player.name;
        state.elements.detailMatchModal.selectPlayerTabEvent.appendChild(optionPlayer);
    })

}
state.elements.detailMatchModal.btnShowPanelAddEvent.addEventListener('click', (e) => {
    $('#eventFormPanel').offcanvas('show');
    _prepareDataEditEventMatch(state.current_edit_match);
});
document.querySelectorAll('.change-time-start').forEach((el) => {
    el.addEventListener('change', (e) => {
        let round = document.getElementById('detail-round-flow').value;
        const second_max_round = time_max[`round_${round}`] * 60;
        const second_min_round = time_max[`min_round_${round}`] * 60;
        const minutes          = document.getElementById('minute_flow').value;
        const seconds          = document.getElementById('second_flow').value;

        const regex_minute = /^\d+$/;
        const regex_second = /^(?:[0-5]?\d)$/;
        console.log(regex_minute.test(minutes), regex_second.test(seconds));

        document.getElementById('detail-info-valid-round').innerHTML = "";
        if(regex_minute.test(minutes) && regex_second.test(seconds)) {
            const total_second = parseInt(minutes) * 60 + parseInt(seconds);
            if (total_second > second_max_round) {
                document.getElementById('detail-info-valid-round').appendChild(spanBagdeInjuryRound);
            } else if (total_second < second_min_round) {
                document.getElementById('detail-info-valid-round').appendChild(spanBagdeInValidRound);
            }else {
                document.getElementById('detail-info-valid-round').appendChild(spanBagdeValidRound)
            }
        } else {
            document.getElementById('detail-info-valid-round').appendChild(spanBagdeInValidRound);
        }
    });
}); 

state.elements.detailMatchModal.btnAddEvent.addEventListener('click', (e) => {
    const current_match = state.current_edit_match;
    const round         = document.getElementById('detail-round-flow').value;
    const minutes       = document.getElementById('minute_flow').value;
    const seconds       = document.getElementById('second_flow').value;
    const eventType     = document.getElementById('detail-event-type').value;
    const teamIndex     = document.getElementById('detail-team-id').value;
    const playerId      = document.getElementById('detail-player-id').value;
    const note          = document.getElementById('detail-note').value;
    // Mốt còn validate (nếu có)
    // _validateAddEventMatchFlow(round, minutes, seconds, eventType, teamId, playerId, note);
    // Thêm event vào state
    current_match.teams[teamIndex].score =  current_match.teams[teamIndex].score ? current_match.teams[teamIndex].score + 1 : 1;
    _addEventMatchFlow(round, minutes, seconds, eventType, teamIndex, playerId, note);
    
    

})
function _addEventMatchFlow(round, minutes, seconds, eventType, teamIndex, playerId, note) {
    if(eventType == 1) {
        _addGoalEvent(round, minutes, seconds, teamIndex, playerId, note);
    } else if(eventType == 2) {
        _addYellowCardEvent(round, minutes, seconds, teamIndex, playerId, note);
    } else if(eventType == 3) {
        _addRedCardEvent(round, minutes, seconds, teamIndex, playerId, note);
    } else if(eventType == 4) {
        _addSubstitutionEvent(round, minutes, seconds, teamIndex, playerId, note);
    }
}

function _addGoalEvent(round, minutes, seconds, teamIndex, playerId, note) {
    const goal_template = document.getElementById('goal-template');
    const goalEL = goal_template.content.cloneNode(true);
    const matchFlowListEL = state.elements.detailMatchModal.matchFlowList;
    goalEL.querySelectorAll('.match-flow-name-team1')[0].textContent = state.current_edit_match.teams[0].team.name;
    goalEL.querySelectorAll('.match-flow-name-team2')[0].textContent = state.current_edit_match.teams[1].team.name;
    goalEL.querySelectorAll('.match-flow-score-team1')[0].textContent = state.current_edit_match.teams[0].score ?? 0;
    goalEL.querySelectorAll('.match-flow-score-team2')[0].textContent = state.current_edit_match.teams[1].score ?? 0;
    goalEL.querySelectorAll('.match-flow-time')[0].textContent = `${minutes}'`;
    goalEL.querySelectorAll('.match-flow-name-player-goal')[0].textContent = state.current_edit_match.teams[teamIndex].team.players.find(player => player.id == playerId).name;
    goalEL.querySelectorAll('.match-flow-team-goal')[0].textContent = state.current_edit_match.teams[teamIndex].team.name;
    goalEL.querySelectorAll('.match-flow-role-player-goal')[0].textContent = state.current_edit_match.teams[teamIndex].team.players.find(player => player.id == playerId).vi_tri;
    goalEL.querySelectorAll('.match-flow-note')[0].textContent = note;
    matchFlowListEL.prepend(goalEL);

    
}

