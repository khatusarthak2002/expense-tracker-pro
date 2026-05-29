let chart;

function updateChart(expenses) {

    let totals = {};

    // Calculate category totals
    expenses.forEach(exp => {

        totals[exp.category] =
            (totals[exp.category] || 0)
            + Number(exp.amount);

    });

    const canvas =
        document.getElementById("expenseChart");

    const ctx = canvas.getContext("2d");

    // Destroy previous chart
    if (chart) {
        chart.destroy();
    }

    // ===== GRADIENT COLORS =====

    const gradient1 =
        ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, "#60a5fa");
    gradient1.addColorStop(1, "#2563eb");

    const gradient2 =
        ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, "#34d399");
    gradient2.addColorStop(1, "#059669");

    const gradient3 =
        ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, "#fbbf24");
    gradient3.addColorStop(1, "#d97706");

    const gradient4 =
        ctx.createLinearGradient(0, 0, 0, 400);
    gradient4.addColorStop(0, "#f87171");
    gradient4.addColorStop(1, "#dc2626");

    const gradient5 =
        ctx.createLinearGradient(0, 0, 0, 400);
    gradient5.addColorStop(0, "#a78bfa");
    gradient5.addColorStop(1, "#7c3aed");

    const gradient6 =
        ctx.createLinearGradient(0, 0, 0, 400);
    gradient6.addColorStop(0, "#22d3ee");
    gradient6.addColorStop(1, "#0891b2");

    // Create chart
    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: Object.keys(totals),

            datasets: [{

                data: Object.values(totals),

                backgroundColor: [
                    gradient1,
                    gradient2,
                    gradient3,
                    gradient4,
                    gradient5,
                    gradient6
                ],

                borderColor: "#ffffff",

                borderWidth: 5,

                hoverOffset: 25,

                hoverBorderWidth: 8
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        padding: 20,

                        usePointStyle: true,

                        pointStyle: "circle",

                        font: {
                            size: 14,
                            weight: "600"
                        },

                        color: "#374151"
                    }
                },

                tooltip: {

                    backgroundColor: "#111827",

                    titleColor: "#ffffff",

                    bodyColor: "#ffffff",

                    padding: 14,

                    cornerRadius: 12,

                    displayColors: true
                }
            },

            animation: {

                animateRotate: true,

                animateScale: true,

                duration: 1500,

                easing: "easeOutBounce"
            }
        }
    });
}