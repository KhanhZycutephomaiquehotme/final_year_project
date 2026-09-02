function _handleEventIconEdit_Click(e) {
    const settingMatchModalEL                  = state.elements.detailMatchModal.modal;
    const matchKey                             = e.currentTarget.dataset.matchKey;
          settingMatchModalEL.dataset.matchKey = matchKey;
    const [roundIndex, matchIndex]             = matchKey.split("_");
    const match                                = state.tournament.rounds[roundIndex][matchIndex];
    state.current_edit_match = match;
    loadDataEdit(match);
    $('#settingMatch').modal('show');
}
// event click save setting match 
document.getElementById('saveSettingMatch').addEventListener('click', (e) => {
    const settingMatchModalEL      = state.elements.detailMatchModal.modal;
    const matchKey                 = settingMatchModalEL.dataset.matchKey;
    const [roundIndex, matchIndex] = matchKey.split("_");
    const match                    = state.tournament.rounds[roundIndex][matchIndex];
    // Lấy setting trận đấu
    // Sân đấu
    let football_field_id = parseInt(state.elements.detailMatchModal.selectFootballField.value);
    // Trọng tài
    let referee_id = parseInt(state.elements.detailMatchModal.selectReferee.value); 
    // Thời gian diễn ra trận đấu
    let match_time = state.elements.detailMatchModal.matchTime.value;
    // Thiết lập tỉ số
    let setting_match_score = state.elements.detailMatchModal.radioSettingMatchScore1.checked ? 1 : 2;
    // Tỉ số
    let team1_score = state.elements.detailMatchModal.inputScoreTeam1.value ?? 0;
    team1_score = parseInt(team1_score);
    let team2_score = state.elements.detailMatchModal.inputScoreTeam2.value ?? 0;
    team2_score = parseInt(team2_score);
    // lấy setting player trên sân
    const slotTeam1s = document.querySelectorAll('.slot-team-1');
    let players1 = [];
    slotTeam1s.forEach((el, key) => {
        const inputPlayer = el.querySelector('.input-player-data');
        if (inputPlayer) {
            const slotIndex = el.dataset.slotIndex;
            const playerId  = inputPlayer.dataset.playerId;
            const teamId    = inputPlayer.dataset.teamId;
            const player    = {
                'slot_index': parseInt(slotIndex),
                'id'        : parseInt(playerId),
            };
            players1.push(player);
        }
    })
    const slotTeam2s = document.querySelectorAll('.slot-team-2');
    let players2 = [];
    slotTeam2s.forEach((el, key) => {
        const inputPlayer = el.querySelector('.input-player-data');
        if (inputPlayer) {
            const slotIndex = el.dataset.slotIndex;
            const playerId  = inputPlayer.dataset.playerId;
            const teamId    = inputPlayer.dataset.teamId;
            const player    = {
                'slot_index': parseInt(slotIndex),
                'id'        : parseInt(playerId),
            };
            players2.push(player);
        }
    })
    // Lưu setting cầu thủ trên sân

    match.football_field_id   = football_field_id;
    match.referee_id          = referee_id;
    match.match_time          = match_time;
    match.setting_match_score = setting_match_score;
    match.team1_score         = team1_score;
    match.team2_score         = team2_score;

    match.teams[0].detail.players = players1;
    match.teams[1].detail.players = players2;
})
function loadDataEdit(match) {
    const detailMatchModal = state.elements.detailMatchModal;

    detailMatchModal.selectFootballField.value       = match.football_field_id;
    detailMatchModal.selectReferee.value             = match.referee_id;
    
    detailMatchModal.matchTime.value                 = match.match_time;
    detailMatchModal.radioSettingMatchScore1.checked = match.setting_match_score == 1 ? true : false;
    detailMatchModal.radioSettingMatchScore2.checked = match.setting_match_score == 2 ? true : false;
    
    // trigger event change của 1 trong 2 checkbox để disable ô nhập tỉ số
    detailMatchModal.radioSettingMatchScore1.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Do dùng select2, nên các select cũng phải chạy event change để cho cập nhật lại selected
    detailMatchModal.selectFootballField.dispatchEvent(new Event('change', { bubbles: true }));
    detailMatchModal.selectReferee.dispatchEvent(new Event('change', { bubbles: true }));

    detailMatchModal.inputScoreTeam1.value           = match.team1_score;
    detailMatchModal.inputScoreTeam2.value           = match.team2_score;

    let detail_team1 = match.teams[0];
    let detail_team2 = match.teams[1];
    
    // Lọc ra những player chưa có trên sân
    let team1_player_ids_in_pitch = detail_team1.detail.players.map((slot) => slot.id);
    let team2_player_ids_in_pitch = detail_team2.detail.players.map((slot) => slot.id);

    let team1 = {...detail_team1.team};
    let team2 = {...detail_team2.team};

    team1.players = team1.players.filter((player) => !team1_player_ids_in_pitch.includes(player.id));
    team2.players = team2.players.filter((player) => !team2_player_ids_in_pitch.includes(player.id));

    renderPlayerInFootballPitch(true, detail_team1, detail_team2);
    renderPlayerInList(team1, team2);
    renderSortableSlotPlayer();
}
state.elements.detailMatchModal.radioSettingMatchScores.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        const selectedValue = event.target.id;
        if (selectedValue === 'radioSettingMatchScore1') {
            // Tự thiết lập
            state.elements.detailMatchModal.inputScoreTeam1.disabled = false;
            state.elements.detailMatchModal.inputScoreTeam2.disabled = false;
        } else if (selectedValue === 'radioSettingMatchScore2') {
            // Thiết lập theo diễn biến trận đấu
            state.elements.detailMatchModal.inputScoreTeam1.disabled = true;
            state.elements.detailMatchModal.inputScoreTeam2.disabled = true;
        }
        state.elements.detailMatchModal.inputScoreTeam1.value = 0;
        state.elements.detailMatchModal.inputScoreTeam2.value = 0;

        _updateMatchEventLock();
    });
});

state.elements.detailMatchModal.btnEnableMatchFlow.addEventListener('click', () => {
    state.elements.detailMatchModal.radioSettingMatchScore2.checked = true;

    state.elements.detailMatchModal.radioSettingMatchScore2.dispatchEvent(
        new Event('change', { bubbles: true })
    );
});


function _updateMatchEventLock() {
    state.elements.detailMatchModal.matchFlowLock.classList.toggle(
        'hidden',
        state.elements.detailMatchModal.radioSettingMatchScore2.checked
    );
    if (state.elements.detailMatchModal.radioSettingMatchScore2.checked) {
        state.elements.detailMatchModal.matchFlowContainerDemo.style.setProperty("display", "none", "important");
        state.elements.detailMatchModal.matchFlowContainer.style.setProperty("display", "block", "important");
    } else {
        state.elements.detailMatchModal.matchFlowContainerDemo.style.setProperty("display", "block", "important");
        state.elements.detailMatchModal.matchFlowContainer.style.setProperty("display", "none", "important");
    }
}


