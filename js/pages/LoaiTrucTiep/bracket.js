// function renderBracket(selector, data) {

//     const bracket = document.querySelector(selector);

//     bracket.innerHTML = `
//         <svg class="bracket-line"></svg>
//         <div class="bracket-content"></div>
//     `;

//     const content = bracket.querySelector(".bracket-content");

//     data.forEach(round => {

//         const roundEl = document.createElement("div");
//         roundEl.className = "round";

//         roundEl.innerHTML = `
//             <div class="round-title">${round.title}</div>
//             <div class="matches"></div>
//         `;

//         const matches = roundEl.querySelector(".matches");

//         round.matches.forEach(match => {

//             const matchEl = document.createElement("div");
//             matchEl.className = "match";

//             match.teams.forEach(team => {

//                 const teamEl = document.createElement("div");
//                 teamEl.className = "team";

//                 teamEl.innerHTML = `
//                     <div class="team-icon">🏆</div>

//                     <div class="team-name">
//                         ${team.name}
//                     </div>

//                     <div class="team-score">
//                         ${team.score ?? "-"}
//                     </div>
//                 `;

//                 matchEl.appendChild(teamEl);

//             });

//             matches.appendChild(matchEl);

//         });

//         content.appendChild(roundEl);

//     });

// }
function renderBracketNew(selector, data = [], isCreate = true) {
     
    const bracket = document.querySelector(selector);

    bracket.innerHTML = `
        <div class="bracket-content"></div>
        <svg id="bracket-line"></svg>
    `;

    const content     = bracket.querySelector(".bracket-content");
    const team_length = data.length;
    // Lấy số vòng
    let round_team  = team_length;
    let count_round = 0;

    while (round_team > 1) {
        // Tạo số vòng
        let txt_round_team = `Round of 32`;
        if (round_team == 16) {
            txt_round_team = 'Vòng 1 / 8'
        }else if (round_team == 8) {
            txt_round_team = "Tứ kết"
        } else if (round_team == 4) {
            txt_round_team = "Bán kết";
        } else if (round_team == 2) {
            txt_round_team = "Chung kết";
        }
        const roundEl = document.createElement("div");
        roundEl.className = "round";
        roundEl.innerHTML = `
            <div class="round-title">${txt_round_team}</div>
            <div class="matches"></div>
        `;
        let round = [];
        // Tạo số trận
        const matches = roundEl.querySelector(".matches");
        let matchList = [];
        for (let i_match = 0; i_match < (round_team / 2); i_match++) {
            let match = {
                'match_number': i_match,
                'teams' : [

                ]
            };
            // Tạo div bọc Match
            const editMatchContent = document.createElement('div');
            // Tạo detail trên
            const detailTop = document.createElement('div');
            detailTop.className = "row";
            detailTop.innerHTML = `
                <div class="col-4 text-start">Sân đấu</div>
                <div class="col-4 text-center"><i class="bi bi-pencil-square edit-team-round" data-match-key="${count_round}_${i_match}" style="display: none"></i></div>
                <div class="col-4 text-end">Tỷ số</div>
            `
            editMatchContent.appendChild(detailTop);
            
            const matchEl = document.createElement("div");
            matchEl.className = `match`;
            matchEl.dataset.matchKey = `${count_round}_${i_match}`;
            matchEl.id = `match-${count_round}-${i_match}`;


            // Tạo slot team
            for (let i_team = 0; i_team < 2; i_team++) {
                const teamEl = document.createElement("div");
                teamEl.dataset.matchKey = `${count_round}_${i_match}`;
                teamEl.className = "team";
                // teamEl.innerHTML = `<div>Trống</div>`;
                
                const scoreEl = document.createElement("div");
                scoreEl.className = "score";
                scoreEl.textContent = "-";


                matchEl.appendChild(teamEl);
                matchEl.appendChild(scoreEl);


            }
            editMatchContent.appendChild(matchEl);
            // Tạo detail trên
            const detailBottom = document.createElement('div');
            detailBottom.className = "row";
            detailBottom.innerHTML = `
                <div class="col-4 text-start">Ngày đấu</div>
                <div class="col-4 text-center"></div>
                <div class="col-4 text-end">Tỷ số</div>
            `
            editMatchContent.appendChild(detailBottom);
            matches.appendChild(editMatchContent);
            round.push(match);
        }
        if (isCreate) rounds.push(round);
        content.appendChild(roundEl);
        round_team = Math.floor(round_team / 2);
        count_round++;
    }
    const iconEditEL = content.querySelectorAll('.edit-team-round');
    iconEditEL.forEach((el)=> {
        el.addEventListener('click', (e) => {
            _handleEventIconEdit_Click(e);
        })
    });


    // Thêm vào vị trị lụm cup
    const winRound = document.createElement('div');
    winRound.className = "round";
    winRound.innerHTML = `
        <div class="round-title">Lụm cup</div>
        <div class="matches">
            <div class="match">
                <div class="team team-last" id="match-${count_round}-0"></div>
            </div>
            
        </div>
    `;
    content.appendChild(winRound);
    // Tạo đường line cho bracket
    renderLineBracket();

}
function _handleEventIconEdit_Click(e) {
    console.log(e);
    const matchKey = e.currentTarget.dataset.matchKey;
    const [roundIndex, matchIndex] = matchKey.split("_");
    const match = rounds[roundIndex][matchIndex];
    loadDataEdit(match);
    $('#settingMatch').modal('show');


    
}
function loadDataEdit(match) {
    
    const detail_team1 = match.teams[0];
    const detail_team2 = match.teams[1];

    renderPlayerInList(detail_team1.team, detail_team2.team);
    renderSortableSlotPlayer();
}
function renderLineBracket(){
    const svg = document.querySelector("#bracket-line");
    svg.innerHTML = '';
    const rounds = document.querySelectorAll('.round');
    const count_round = rounds.length;
    for (let i = 0; i < count_round - 1; i++) {
        const matchs_current = rounds[i].querySelectorAll('.match');
        const matchs_next    = rounds[i+1].querySelectorAll('.match');
        const count_match    = matchs_current.length;
        
        let index_match_next = 0;
        for (let j = 0; j < count_match; j = j + 2) {
            a = matchs_current[j];
            b = matchs_current[j+1];
            c = null;
            if (!b) {

                b = matchs_next[index_match_next++];
            } else c = matchs_next[index_match_next++];
            _renderLineBracket(a, b, c);
                
        }
        
    }

}
function _renderLineBracket(a, b, c = null) {
    const svg = document.querySelector("#bracket-line");
    const p1 = pointRight(a, svg);
    let p2, p3;
    if (c == null) {
        p2 = pointLeft(b, svg);
    } else {

        p2 = pointRight(b, svg);
        p3 = pointLeft(c, svg);
    }

    let path = null;
    if (c != null) {

        const joinX = p1.x + 50;
        const joinY = (p1.y + p2.y)/2;
    
        path = `
        M ${p1.x} ${p1.y}
        H ${joinX}
        V ${joinY}
        H ${p3.x}
    
        M ${p2.x} ${p2.y}
        H ${joinX}
        V ${joinY}
        `;
    } else {
        path = `
            M ${p1.x} ${p1.y}
            L ${p2.x} ${p2.y}
        `;
    }

    const pathEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    pathEl.setAttribute("d", path);
    pathEl.setAttribute("stroke", "#000");
    pathEl.setAttribute("stroke-width", "2");
    pathEl.setAttribute("fill", "none");
    svg.appendChild(pathEl);
}
function pointRight(el, svg){

    const r = el.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    return {
        x: r.right - svgRect.left,
        y: r.top + r.height/2 - svgRect.top
    };
}

function pointLeft(el, svg){

    const r = el.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    return {
        x: r.left - svgRect.left,
        y: r.top + r.height/2 - svgRect.top
    };
}
function renderListTeam() {
    const listTeam = document.querySelector('#list-team');
    data.forEach((team) => {
        const teamEL = document.createElement('div');
        teamEL.className = "team-in-list";
        teamEL.dataset.teamId = team.id;
        teamEL.innerHTML = `
            <div class="team-icon">🏆</div>

            <div class="team-name">
                ${team.name}
            </div>

            
        `;
        listTeam.appendChild(teamEL);
    });
}
function renderSortable() {
    const listTeamEL = document.getElementById('list-team');
    new Sortable(listTeamEL, {
        group: {
            name: 'players',
            // pull: 'clone',   // kéo sẽ clone
            // put: false       // không nhận item
        },
        sort: false,
        // handle: '.drag-handle',
        bubbleScroll: true,
        forceFallback: true,
        animation: 150
    });
    // Mỗi slot là một sortable riêng
    document.querySelectorAll('.round')[0].querySelectorAll('.team').forEach(slot => {

        new Sortable(slot, {
            group: 'players',
            // handle: '.drag-handle',
            bubbleScroll: true,
			forceFallback: true,
            animation: 150,
            onAdd(evt) {

                const newItem = evt.item;
                const from = evt.from;
                const to = evt.to;

                const target = _handleGetSlotInfo(to);

                const targetMatch = target.match;
                const targetIndex = target.slotIndex;


                // =================================================
                // CASE 2: SLOT → SLOT
                // =================================================

                if (from !== listTeamEL) {

                    const source = _handleGetSlotInfo(from);

                    const sourceMatch = source.match;
                    const sourceIndex = source.slotIndex;


                    // Slot đích đang có team
                    const oldItem = [...to.children]
                        .find(el => el !== newItem);


                    // ---------------------------------------------
                    // SWAP
                    // ---------------------------------------------

                    if (oldItem) {

                        // Đổi DOM
                        from.appendChild(oldItem);

                        // Đổi DATA
                        [
                            sourceMatch.teams[sourceIndex],
                            targetMatch.teams[targetIndex]
                        ] = [
                            targetMatch.teams[targetIndex],
                            sourceMatch.teams[sourceIndex]
                        ];


                        _handleUpdateMatch(source.matchEL);
                        _handleUpdateMatch(target.matchEL);

                        return;
                    }


                    // ---------------------------------------------
                    // SLOT → SLOT TRỐNG
                    // ---------------------------------------------

                    targetMatch.teams[targetIndex] =
                        sourceMatch.teams[sourceIndex];

                    sourceMatch.teams[sourceIndex] =
                        _handleEmptyTeamSlot();


                    _handleUpdateMatch(source.matchEL);
                    _handleUpdateMatch(target.matchEL);

                    return;
                }


                // =================================================
                // CASE 1: LIST → SLOT
                // =================================================

                const oldItem = [...to.children]
                    .find(el => el !== newItem);


                // Team cũ trả về list
                if (oldItem) {
                    listTeamEL.appendChild(oldItem);
                }


                const teamId = Number(
                    newItem.dataset.teamId
                );

                const team = data.find(
                    item => Number(item.id) === teamId
                );

                if (!team) {
                    return;
                }


                // ---------------------------------------------
                // CẬP NHẬT TRỰC TIẾP VÀO ROUNDS
                // ---------------------------------------------

                targetMatch.teams[targetIndex] = {
                    team: team,

                    // Team mới => detail mới
                    detail: {
                        players: [],
                        formation: {}
                    }
                };


                _handleUpdateMatch(target.matchEL);
            },


            // =====================================
            // REMOVE
            // =====================================

            onRemove(evt) {

                const from = evt.from;
                const to = evt.to;


                // =================================================
                // SLOT → SLOT
                //
                // Đây là CASE 2.
                // onAdd bên slot đích đã xử lý swap.
                //
                // KHÔNG được xóa rounds ở đây.
                // =================================================

                if (to !== listTeamEL) {
                    return;
                }


                // =================================================
                // CASE 3: SLOT → LIST
                // =================================================

                const source = _handleGetSlotInfo(from);

                source.match.teams[source.slotIndex] =
                    _handleEmptyTeamSlot();


                _handleUpdateMatch(source.matchEL);
            }

        });

    });
}
function _handleUpdateMatch (matchEL) {
     const matchKey = matchEL.dataset.matchKey;

    const teamEls = matchEL.querySelectorAll(
        `.team[data-match-key="${matchKey}"]:has(.team-in-list)`
    );

    const iconEditEL = document.querySelector(
        `.edit-team-round[data-match-key="${matchKey}"]`
    );

    if (iconEditEL) {
        iconEditEL.style.display =
            teamEls.length === 2 ? 'block' : 'none';
    }

    const teams = [...teamEls]
        .map(el => data.find(item => item.id == el.dataset.teamId))
        .filter(Boolean);

    const [roundIndex, matchIndex] = matchKey.split('_');

    const match = rounds[roundIndex][matchIndex];

    return {
        match,
        teams
    };
}
function _handleEmptyTeamSlot() {
    return {
        team: null,
        detail: {
            players: [],
            formation: {}
        }
    };
}
function _handleGetSlotInfo(slotEL) {
    const matchEL = slotEL.closest('.match');
    const matchKey = matchEL.dataset.matchKey;

    const [roundIndex, matchIndex] = matchKey.split('_');

    const slotIndex = [...matchEL.querySelectorAll('.team')]
        .indexOf(slotEL);

    return {
        slotEL,
        matchEL,
        matchKey,
        slotIndex,
        match: rounds[roundIndex][matchIndex]
    };
}