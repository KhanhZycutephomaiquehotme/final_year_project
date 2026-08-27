// }
/** 
 * Function render bracket mới
 * @param {number} team_length Số lượng đội
 * @param {boolean} isCreate Có phải là thêm mới hay không? (Cờ check nếu là thêm mới thì mới khởi tạo mảng rounds tạm thời)
 */
function renderBracketNew(team_length, isCreate = true) {

    const content     = state.elements.bracketContent;
    // Lấy số vòng
    let round_team  = team_length;
    let count_round = 0;

    while (round_team > 1) {
        // Tạo số vòng
        let txt_round_team = `Round of ${round_team}`;
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
                'match_number'       : i_match,
                'round_number'       : count_round,
                'football_field_id'  : null,
                'referee_id'         : null,
                'match_time'         : null,
                'setting_match_score': 1,
                'team1_score'        : 0,
                'team2_score'        : 0,
                'teams'              : [

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
        if (isCreate) state.tournament.rounds.push(round);
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
/**
 * Hàm vẽ đường line cho bracket
 */
function renderLineBracket() {
    const svg = state.elements.bracketLine;
    const bracket = state.elements.bracket;

    svg.innerHTML = '';

    // Lấy toàn bộ kích thước nội dung bracket
    const width = bracket.scrollWidth;
    const height = bracket.scrollHeight;

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    svg.style.width = `${width}px`;
    svg.style.height = `${height}px`;

    const rounds = bracket.querySelectorAll('.round');
    const count_round = rounds.length;

    for (let i = 0; i < count_round - 1; i++) {
        const matchs_current = rounds[i].querySelectorAll('.match');
        const matchs_next = rounds[i + 1].querySelectorAll('.match');

        const count_match = matchs_current.length;

        let index_match_next = 0;

        for (let j = 0; j < count_match; j += 2) {
            let a = matchs_current[j];
            let b = matchs_current[j + 1];
            let c = null;

            if (!b) {
                b = matchs_next[index_match_next++];
            } else {
                c = matchs_next[index_match_next++];
            }

            _renderLineBracket(a, b, c);
        }
    }
}
/**
 * Function vẽ đường line giữa 2 trận đấu
 * @param {Element} a Element match thứ 1
 * @param {Element} b Element match thứ 2
 * @param {Element} c Element match của vòng sau (Nếu có)
 */
function _renderLineBracket(a, b, c = null) {
    const svg = state.elements.bracketLine;
    const bracket = state.elements.bracket;

    const p1 = pointRight(a, bracket);

    let p2, p3;

    if (c == null) {
        p2 = pointLeft(b, bracket);
    } else {
        p2 = pointRight(b, bracket);
        p3 = pointLeft(c, bracket);
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
function pointRight(el, container) {
    const r = el.getBoundingClientRect();
    const c = container.getBoundingClientRect();

    return {
        x: r.right - c.left + container.scrollLeft,
        y: r.top + r.height / 2 - c.top + container.scrollTop
    };
}
function pointLeft(el, container) {
    const r = el.getBoundingClientRect();
    const c = container.getBoundingClientRect();

    return {
        x: r.left - c.left + container.scrollLeft,
        y: r.top + r.height / 2 - c.top + container.scrollTop
    };
}
/**
 * Function render danh sách đội bóng (Dùng để kéo thả vào các slot của bracket)
 */
function renderListTeam() {
    const listTeam = state.elements.listTeam;
    state.data.teams.forEach((team) => {
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
/**
 * Function khởi tạo sortable cho các slot của bracket và danh sách đội bóng
 * 1. Kéo thả từng đội bóng ở danh sách đội bóng vào ô slot (hoặc ngược lại)
 * 2. Mỗi slot chỉ được chứ 1 đội
 * 3. Khi kéo 1 đội khác vào slot đã có đội thì sẽ swap 2 đội
 */
function renderSortable() {
    const listTeamEL = state.elements.listTeam;
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

    const match = state.tournament.rounds[roundIndex][matchIndex];

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
        match: state.tournament.rounds[roundIndex][matchIndex]
    };
}