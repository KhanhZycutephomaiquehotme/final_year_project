/**
 * Function render slot cầu thủ trên sân
 * @param {*} reload_detail 
 * @param {*} team1 
 * @param {*} team2 
 */
function renderPlayerInFootballPitch(reload_detail = false, team1 = null, team2 = null) {
    // Render số cầu thủ trên sân
    const overlay = state.elements.detailMatchModal.footballOverlay;
    overlay.innerHTML = '';

    let slot_index = 28;
    let team = reload_detail ? team1 : [];
    for(let i=0;i<10;i++){

        const row = document.createElement("div");
        row.className = "football-row";
        let max_slot = [0,9].includes(i) ? 1 : 7;
        let classTeam = i >= 0 && i < 5 ? 'slot-team-1' : "slot-team-2";
        if (i == 5)  {
            slot_index = 0;
            team = reload_detail ? team2 : [];
        }

        for(let j=0;j<max_slot;j++){

            const player = document.createElement("div");
            player.dataset.slotIndex = slot_index;
            player.className = `player-slot-in-pitch ${classTeam}`;
            const find_player = team?.detail?.players?.find(p => p.slot_index == slot_index);
            if (find_player) {
                const divPlayer = document.createElement('div');
                const playerobj = team.team.players.find(p => p.id == find_player.id);
                divPlayer._player = playerobj;
                renderPlayerAvatar(divPlayer);
                player.appendChild(divPlayer);
            }

            row.appendChild(player);
            
            slot_index += (i >= 0 && i < 5) ? -1 : 1;   
        }

        overlay.appendChild(row);
    }
}
function getAvatarText(name) {
    if (!name) return "";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[words.length - 2][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}
function renderPlayerInList(team1, team2) {

    // reset data

    // Container danh sách cầu thủ của 2 đội bóng
    const divPlayerList = state.elements.detailMatchModal.playerList;
    // Tên đội bóng 1
    const team1NameEl = divPlayerList.querySelector('#team1-name');
    // Danh sách cầu thủ đội 1
    const team1El = divPlayerList.querySelector('#list-player-in-team1');
    // Tên đội bóng 2
    const team2NameEl = divPlayerList.querySelector('#team2-name');
    // Dánh sách cầu thủ đội 2
    const team2El = divPlayerList.querySelector('#list-player-in-team2');


    // RESET DATA
    team1NameEl.innerHTML = '';
    team1El.innerHTML     = '';
    team2NameEl.innerHTML = '';
    team2El.innerHTML     = '';




    // Render tên đội, cầu thủ đội 1
    // Tên đội
    team1NameEl.innerHTML = team1.name;
    // Cầu thủ của đội
    team1.players.forEach(player => {
        const playerInListEl = document.createElement('div');

        playerInListEl.className = 'row me-0 pe-0 mt-2';

        // Lưu object player vào element
        playerInListEl._player = player;

        renderPlayerFull(playerInListEl);

        team1El.appendChild(playerInListEl);
    });

    // Render tên đội, cầu thủ đội 2
    // Tên đội
    team2NameEl.innerHTML = team2.name;

    // Cầu thủ của đội
    team2.players.forEach(player => {
        const playerInListEl = document.createElement('div');

        playerInListEl.className = 'row me-0 pe-0 mt-2';

        // Lưu object player vào element
        playerInListEl._player = player;

        renderPlayerFull(playerInListEl);

        team2El.appendChild(playerInListEl);
    });
}
function renderPlayerFull(playerEl) {
    const player = playerEl._player;
    const inputPlayer = document.createElement('input');
    inputPlayer.className = 'input-player-data';
    inputPlayer.type = 'hidden';
    inputPlayer.dataset.teamId = player.id;
    inputPlayer.dataset.playerId = player.id;

    playerEl.className = 'row me-0 pe-0 mt-2';

    playerEl.innerHTML = `
        <div class="col-3">
            <div class="player-avatar">
                <span>${getAvatarText(player.name)}</span>
            </div>
        </div>

        <div class="col-8 text-start">
            <div>
                Tên: ${player.name}
            </div>
            <div>
                Vai trò: ${player.vi_tri}
            </div>
        </div>
    `;
    playerEl.appendChild(inputPlayer);
}
function renderPlayerAvatar(playerEl) {
    const player = playerEl._player;
    const inputPlayer = document.createElement('input');
    inputPlayer.className = 'input-player-data';
    inputPlayer.type = 'hidden';
    inputPlayer.dataset.teamId = player.id;
    inputPlayer.dataset.playerId = player.id;

    playerEl.className = 'player-avatar-in-pitch';

    playerEl.innerHTML = `
        <div class="player-avatar">
            <span>${getAvatarText(player.name)}</span>
        </div>
    `;
    playerEl.appendChild(inputPlayer);
}
function renderSortableSlotPlayer () {
    new Sortable(document.getElementById('list-player-in-team1'), {
        group: {
            name: 'slot-team1',
            // pull: 'clone',   // kéo sẽ clone
            // put: false       // không nhận item
        },
        sort: false,
        // handle: '.drag-handle',
        bubbleScroll: true,
        // forceFallback: true,
        animation: 150,
        onStart(evt) {
            const player = evt.item._player;

            // Element đang được kéo
            evt.item.classList.add('player-dragging');
            renderPlayerAvatar(evt.item);
        },

        onEnd(evt) {
            // Nếu kéo thất bại / quay lại list
            if (evt.to === evt.from) {
                renderPlayerFull(evt.item);
            }
        },
        onAdd(evt) {
            renderPlayerFull(evt.item);
        }
    });
    new Sortable(document.getElementById('list-player-in-team2'), {
        group: {
            name: 'slot-team2',
            // pull: 'clone',   // kéo sẽ clone
            // put: false       // không nhận item
        },
        sort: false,
        // handle: '.drag-handle',
        bubbleScroll: true,
        // forceFallback: true,
        animation: 150,
        onStart(evt) {
            const player = evt.item._player;

            // Element đang được kéo
            evt.item.classList.add('player-dragging');
            renderPlayerAvatar(evt.item);
        },

        onEnd(evt) {
            // Nếu kéo thất bại / quay lại list
            if (evt.to === evt.from) {
                renderPlayerFull(evt.item);
            }
        },
        onAdd(evt) {
            renderPlayerFull(evt.item);
        }
    });
    document.querySelectorAll('.football-row').forEach((row, index_row) =>{
        row.querySelectorAll('.player-slot-in-pitch').forEach((slot, index_slot)=> {
            const group_name = index_row >= 0 && index_row < 5 ? "slot-team1" : "slot-team2";
            const list_team = index_row >= 0 && index_row < 5 ? "list-player-in-team1" : "list-player-in-team2";
            new Sortable(slot, {
                group: group_name,
                // handle: '.drag-handle',
                bubbleScroll: true,
                // forceFallback: true,
                animation: 150,
                onAdd(evt) {

                    // Player vừa được kéo vào slot
                    const newItem = evt.item;

                    // Nếu slot đã có player
                    if (evt.to.children.length > 1) {

                        const oldItem = [...evt.to.children]
                            .find(el => el !== newItem);

                        if (oldItem) {

                            const listItem =
                                document.getElementById(list_team);

                            // Đưa player cũ về list
                            listItem.appendChild(oldItem);

                            // Render lại dạng full
                            // renderPlayerFull(oldItem);
                        }
                    }

                    // Player mới trong sân chỉ hiện avatar
                    renderPlayerAvatar(newItem);
                }
            });
        });
         

    })
}