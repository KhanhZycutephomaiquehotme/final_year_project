function _handleEventIconEdit_Click(e) {
    const settingMatchModalEL                  = state.elements.detailMatchModal.modal;
    const matchKey                             = e.currentTarget.dataset.matchKey;
          settingMatchModalEL.dataset.matchKey = matchKey;
    const [roundIndex, matchIndex]             = matchKey.split("_");
    const match                                = state.tournament.rounds[roundIndex][matchIndex];
    loadDataEdit(match);
    $('#settingMatch').modal('show');
}
// event click save setting match 
document.getElementById('saveSettingMatch').addEventListener('click', (e) => {
    const settingMatchModalEL      = state.elements.detailMatchModal.modal;
    const matchKey                 = settingMatchModalEL.dataset.matchKey;
    const [roundIndex, matchIndex] = matchKey.split("_");
    const match                    = state.tournament.rounds[roundIndex][matchIndex];
    // const team1 = match.teams[0];
    // const team2 = match.teams[1];
    // lấy setting player trên sân
    const slotTeam1s = document.querySelectorAll('.slot-team-1');
    players1 = [];
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
    players2 = [];
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
    state.tournament.rounds[roundIndex][matchIndex].teams[0].detail.players = players1;
    state.tournament.rounds[roundIndex][matchIndex].teams[1].detail.players = players2;
})
function loadDataEdit(match) {
    
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

