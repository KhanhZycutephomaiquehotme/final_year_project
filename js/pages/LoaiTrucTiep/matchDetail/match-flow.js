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

document.querySelectorAll('.change-time-start').forEach((el) => {
    el.addEventListener('change', (e) => {
        let round = document.getElementById('round-flow').value;
        console.log(round);
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

