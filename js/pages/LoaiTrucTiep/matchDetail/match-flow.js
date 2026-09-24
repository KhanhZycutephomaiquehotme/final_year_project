const spanBagdeValidRound = document.createElement('span');
spanBagdeValidRound.className = "badge rounded-pill bg-success";
spanBagdeValidRound.innerHTML = "Thời gian của hiệp <span class='alert-detail-type-round'>1</span>"

const spanBagdeInValidRound = document.createElement('span');
spanBagdeInValidRound.className = "badge rounded-pill bg-danger";
spanBagdeInValidRound.innerHTML = "Thời gian của hiệp <span class='alert-detail-type-round'>1</span> không hợp lệ"

const spanBagdeInjuryRound = document.createElement('span');
spanBagdeInjuryRound.className = "badge rounded-pill bg-warning text-dark";
spanBagdeInjuryRound.innerHTML = "Thời gian bù giờ của hiệp <span class='alert-detail-type-round'>1</span>";

// document.getElementById('detail-info-valid-round').innerHTML = "";
document.getElementById('detail-info-valid-round').appendChild(spanBagdeValidRound)
function reloadPlayerInAndOutMatch () {
    const match = state.current_edit_match;
    const detail_team_1 = match.teams[0];
    const detail_team_2 = match.teams[1];
    const player_in_and_out_match_1 = _getTeamPlayerInAndOutMatch(detail_team_1);
    const player_in_and_out_match_2 = _getTeamPlayerInAndOutMatch(detail_team_2);

    detail_team_1.detail.current_player_in_match = player_in_and_out_match_1.player_in_match;
    detail_team_1.detail.current_player_out_match = player_in_and_out_match_1.player_out_match;


    detail_team_2.detail.current_player_in_match = player_in_and_out_match_2.player_in_match;
    detail_team_2.detail.current_player_out_match = player_in_and_out_match_2.player_out_match;
    state.elements.detailMatchModal.selectTeamTabEvent.dispatchEvent(new Event('change', { bubbles: true }));

}
function _getTeamPlayerInAndOutMatch (team) {
    const player_in_match = [];
    const player_out_match = [];
    team.detail.players.forEach((item,index) => {
        let count_out_match = team.detail.events.filter((event) => event.player2Id == item.id && event.eventType == 4).length;
        let count_in_match = team.detail.events.filter((event) => event.playerId == item.id && event.eventType == 4).length;

        let has_red_card = team.detail.events.some((event) => event.playerId == item.id && event.eventType == 3);

        let has_2_yellow_card = team.detail.events.filter((event) => event.playerId == item.id && event.eventType == 2).length >= 2 ? true : false;

        // Nếu số lần ra sân == số lần vào sân => cầu thủ được phép thay ra
        let check_in_match = true;
        if (count_out_match != count_in_match || has_red_card || has_2_yellow_card) {
            check_in_match = false;
        }

        if (check_in_match) player_in_match.push(item);
        else player_out_match.push(item);

    })
    return {player_in_match : player_in_match, player_out_match: player_out_match};
}
function _prepareDataEditEventMatch() {

    const match = state.current_edit_match;

    let detail_team1 = match.teams[0];
    let detail_team2 = match.teams[1];
    state.elements.detailMatchModal.selectTeamTabEvent.innerHTML = '';
    // Đội
    
    const optionTeam1 = document.createElement('option');
    // optionTeam1.value = match.teams[0].team.team;
    optionTeam1.value       = detail_team1.team.id;
    optionTeam1.textContent = detail_team1.team.name;
    optionTeam1.dataset.teamIndex = 0;
    state.elements.detailMatchModal.selectTeamTabEvent.appendChild(optionTeam1);
    const optionTeam2 = document.createElement('option');
    optionTeam2.value       = detail_team2.team.id;
    optionTeam2.dataset.teamIndex = 1;
    optionTeam2.textContent = detail_team2.team.name;
    state.elements.detailMatchModal.selectTeamTabEvent.appendChild(optionTeam2);


    // Load player, lấy players còn trên sân và đang ở ngoài sân từ diễn biến trận đấu
    reloadPlayerInAndOutMatch();
    // state.elements.detailMatchModal.selectTeamTabEvent.dispatchEvent(new Event('change', { bubbles: true }));


}
state.elements.detailMatchModal.btnShowPanelAddEvent.addEventListener('click', (e) => {
    $('#eventFormPanel').offcanvas('show');
    _prepareDataEditEventMatch();
});
state.elements.detailMatchModal.selectTeamTabEvent.addEventListener('change', function (e) {
    const value = e.target.value;
    const option = e.target.options[e.target.selectedIndex];

    const teamIndex = option.dataset.teamIndex;
    const players = state.current_edit_match.teams[teamIndex].detail.current_player_in_match;

    state.elements.detailMatchModal.selectPlayerTabEvent.innerHTML = '';
    players.forEach((player) => {
        const optionPlayer             = document.createElement('option');
              optionPlayer.value       = player.id;
              optionPlayer.textContent = player.name;
        state.elements.detailMatchModal.selectPlayerTabEvent.appendChild(optionPlayer);
    });
});
document.querySelectorAll('.change-time-start').forEach((el) => {
    el.addEventListener('change', (e) => {
        let round = document.getElementById('detail-round-flow').value;
        const second_max_round = time_max[`round_${round}`] * 60;
        const second_min_round = time_max[`min_round_${round}`] * 60;
        const minutes          = document.getElementById('minute_flow').value;
        // const seconds          = document.getElementById('second_flow').value;

        const regex_minute = /^\d+$/;
        // const regex_second = /^(?:[0-5]?\d)$/;

        document.getElementById('detail-info-valid-round').innerHTML = "";
        let spanAlert = spanBagdeValidRound;
        if(regex_minute.test(minutes)) {
            const total_second = parseInt(minutes) * 60;
            if (total_second > second_max_round) {
                spanAlert = spanBagdeInjuryRound;
            }
        } else {
            spanAlert = spanBagdeInValidRound;
        }
        document.getElementById('detail-info-valid-round').appendChild(spanAlert);
    });
}); 

state.elements.detailMatchModal.btnAddEvent.addEventListener('click', (e) => {
    const current_match = state.current_edit_match;
    const round         = parseInt(document.getElementById('detail-round-flow').value);
    const minutes       = parseInt(document.getElementById('minute_flow').value);
    // const seconds       = document.getElementById('second_flow').value;
    const eventType = parseInt(document.getElementById('detail-event-type').value);
    const teamId    = parseInt(document.getElementById('detail-team-id').value);
    const teamIndex = parseInt(document.querySelector('#detail-team-id option:checked').dataset.teamIndex);
    const playerId  = parseInt(document.getElementById('detail-player-id').value);
    const note      = document.getElementById('detail-note').value;
    // Mốt còn validate (nếu có)
    // _validateAddEventMatchFlow(round, minutes, seconds, eventType, teamId, playerId, note);
    // Thêm event vào state
    if (eventType == 1) {
        current_match.teams[teamIndex].score =  current_match.teams[teamIndex].score ? current_match.teams[teamIndex].score + 1 : 1;
    }
    current_match.teams[teamIndex].detail.events.push({
        round    : round,
        minutes  : minutes,
        eventType: eventType,
        teamId   : teamId,
        playerId : playerId,
        note     : note,
    });
    const allMatchFlows = [...current_match.teams[0].detail.events, ... current_match.teams[1].detail.events];
    reloadPlayerInAndOutMatch();
    _loadStateMatchFlow(allMatchFlows, current_match.teams[0], current_match.teams[1]);
    // _addEventMatchFlow(round, minutes, eventType, teamIndex, playerId, note);
    
    

})
function _loadStateMatchFlow(matchFlows = [], team_1, team_2) {
    matchFlows.sort((event_1, event_2) => event_1.minutes - event_2.minutes);

    const count_event = matchFlows.length;

    state.elements.detailMatchModal.matchFlowList.textContent = '';
    let score_team_1 = 0;
    let score_team_2 = 0;

    let is_render_round_2 = false;

    let is_render_round_1 = false;

    matchFlows.forEach((item, index) => {
        let flag_team = 1;
        let team_event = team_1;  
        if (team_2.team.id == item.teamId) {
            team_event = team_2;
            flag_team = 2;
        }

        if (index == 0) {
            _addTimeLineRound('Bắt đầu','Thời gian');
            is_render_round_1 = true;
        }

        if (item.round == 2 && !is_render_round_2) {
            _addTimeLineRound('HẾT HIỆP MỘT', `${team_1.team.name} ${score_team_1} - ${score_team_2} ${team_1.team.name}`);
            is_render_round_2 = true;
        }


        if(item.eventType == 1) {
            if (flag_team == 1) {
                score_team_1++;
            } else {
                score_team_2++;
            }
            _addGoalEvent(item, team_event, team_1, team_2, score_team_1, score_team_2);
        } else if(item.eventType == 2) {
            _addYellowCardEvent(item, team_event);
        } else if(item.eventType == 3) {
            _addRedCardEvent(item, team_event);
        } else if(item.eventType == 4) {
            _addSubstitutionEvent(item, team_event);
        }
        if (index == (count_event -1)) {
            _addTimeLineRound('KẾT THÚC TRẬN ĐẤU', `${team_1.team.name} <span class="ms-2">${score_team_1}</span> - <span class="me-2">${score_team_2}</span> ${team_2.team.name}`);
        }
    });
}
// Set lại thời gian diễn biến nếu vượt quá thời gian trận đấu
// VD: thời gian của hiệp 1 là 45, nếu nhập quá 45 thì sẽ trở thành phần phút cộng thêm
// VD: 47 => 45 + 2'
function _renderTimeEvent(minutes, type_round) {
    const time_max = type_round == 1 ? 45 : 90;

    return `${minutes > time_max ? `${time_max} + ${(minutes - time_max)}` : minutes}'`
}

function _addTimeLineRound(title = '', subtitle = '') {
    const timeline_template = document.getElementById('match-flow-timeline-template');
    const timeLineEL = timeline_template.content.cloneNode(true);
    const matchFlowListEL = state.elements.detailMatchModal.matchFlowList;
    timeLineEL.querySelectorAll('.match-flow-timeline-title')[0].innerHTML = title;
    timeLineEL.querySelectorAll('.match-flow-timeline-subtitle')[0].innerHTML = subtitle;

    matchFlowListEL.prepend(timeLineEL);
}

function _addGoalEvent(event, team_event, team_1, team_2, score_team_1 = 0, score_team_2 = 0) {
    const goal_template = document.getElementById('goal-template');
    const goalEL = goal_template.content.cloneNode(true);
    const matchFlowListEL = state.elements.detailMatchModal.matchFlowList;
    goalEL.querySelectorAll('.match-flow-name-team1')[0].textContent = team_1.team.name;
    goalEL.querySelectorAll('.match-flow-name-team2')[0].textContent = team_2.team.name;
    goalEL.querySelectorAll('.match-flow-score-team1')[0].textContent = score_team_1;
    goalEL.querySelectorAll('.match-flow-score-team2')[0].textContent = score_team_2;
    goalEL.querySelectorAll('.match-flow-time')[0].textContent = _renderTimeEvent(event.minutes, event.round);
    goalEL.querySelectorAll('.match-flow-name-player-goal')[0].textContent = team_event.team.players.find(player => player.id == event.playerId).name;
    goalEL.querySelectorAll('.match-flow-team-goal')[0].textContent = team_event.name;
    goalEL.querySelectorAll('.match-flow-name-player-goal')[0].textContent = team_event.team.players.find(player => player.id == event.playerId).name;
    goalEL.querySelectorAll('.match-flow-role-player-goal')[0].textContent = team_event.team.players.find(player => player.id == event.playerId).vi_tri;
    goalEL.querySelectorAll('.match-flow-note')[0].textContent = event.note;
    matchFlowListEL.prepend(goalEL);
}
function _addYellowCardEvent(event, team_event) {
    const yellow_card_template = document.getElementById('yellow-card-template');
    const yellowCarEL          = yellow_card_template.content.cloneNode(true);
    const matchFlowListEL = state.elements.detailMatchModal.matchFlowList;
    yellowCarEL.querySelectorAll('.match-flow-time')[0].textContent = _renderTimeEvent(event.minutes, event.round);
    yellowCarEL.querySelectorAll('.match-flow-name-player-goal')[0].textContent = team_event.team.players.find(player => player.id == event.playerId).name;
    yellowCarEL.querySelectorAll('.match-flow-team-goal')[0].textContent = team_event.team.name;
    yellowCarEL.querySelectorAll('.match-flow-role-player-goal')[0].textContent = team_event.team.players.find(player => player.id == event.playerId).vi_tri;
    yellowCarEL.querySelectorAll('.match-flow-note')[0].textContent = event.note;
    matchFlowListEL.prepend(yellowCarEL);
}
function _addRedCardEvent(event, team_event) {
    const red_card_template = document.getElementById('red-card-template');
    const redCarEL          = red_card_template.content.cloneNode(true);
    const matchFlowListEL = state.elements.detailMatchModal.matchFlowList;
    redCarEL.querySelectorAll('.match-flow-time')[0].textContent = _renderTimeEvent(event.minutes, event.round);
    redCarEL.querySelectorAll('.match-flow-name-player-goal')[0].textContent = team_event.team.players.find(player => player.id == event.playerId).name;
    redCarEL.querySelectorAll('.match-flow-team-goal')[0].textContent = team_event.team.name;
    redCarEL.querySelectorAll('.match-flow-role-player-goal')[0].textContent = team_event.team.players.find(player => player.id == event.playerId).vi_tri;
    redCarEL.querySelectorAll('.match-flow-note')[0].textContent = event.note;
    matchFlowListEL.prepend(redCarEL);
}

