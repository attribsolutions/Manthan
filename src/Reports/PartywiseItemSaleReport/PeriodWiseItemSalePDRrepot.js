import jsPDF from "jspdf";
import "jspdf-autotable";

const PeriodWiseItemSale = () => {
    const data = [
        { date: "2025-07-01", itemName: "Balushahi", partyName: "Chitale Bandhu (Anand)", quantity: 20 },
        { date: "2025-07-05", itemName: "Balushahi", partyName: "Chitale Bandhu (Bajirao Road)", quantity: 10 },
        { date: "2025-07-15", itemName: "Dharwadi Pedha", partyName: "Chitale Bandhu (Anand)", quantity: 30 },
        { date: "2025-07-27", itemName: "Dharwadi Pedha", partyName: "Chitale Bandhu (Khadki)", quantity: 42 },
        { date: "2025-07-31", itemName: "Dharwadi Pedha", partyName: "Chitale Bandhu (Market Yard)", quantity: 50 },
    ];

    const doc = new jsPDF('l', 'pt', 'a4');
    const margin = 10;

    // 🔹 Draw outer border
    function drawBorder() {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        doc.setLineWidth(1.2);
        doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
    }

    // 🔹 Header text
    function pageHeader() {
        doc.setFontSize(16);
        doc.text("CHITALE SWEETS & SNACKS PVT. LTD.", margin + 15, margin + 30);

        doc.setFontSize(9);
        doc.text("Shed No. 44, 427/44, Gultekadi Industrial Estate, Pune 411037", margin + 15, margin + 45);

        doc.setFontSize(13);
        doc.text("Partywise Item Sale Details Report", margin + 15, margin + 65);

        doc.setFontSize(9);
        doc.text("Date: 01/07/2025 To : 31/07/2025", margin + 15, margin + 80);
    }

    // 🔹 Table
    function reportBody() {
        // ✅ Build header rows for 31 days
        const headerTop = ["Party-RowSpan_2", ...Array.from({ length: 16 }, (_, i) => (i + 1).toString()), "Unit"];
        const headerBottom = ["", ...Array.from({ length: 15 }, (_, i) => (i + 17).toString()), "Total"];

        // ✅ Group Data
        const grouped = {};
        data.forEach(({ date, itemName, partyName, quantity }) => {
            const day = new Date(date).getDate();
            const key = `${itemName}|${partyName}`;
            if (!grouped[key]) {
                grouped[key] = { itemName, partyName, quantities: {} };
            }
            grouped[key].quantities[day] = (grouped[key].quantities[day] || 0) + quantity;
        });

        // ✅ Build Table Rows (2 per item)
        const tableBody = [];
        Object.values(grouped).forEach(row => {
            const totalQty = Object.values(row.quantities).reduce((a, b) => a + b, 0).toFixed(2);

            // Row 1 → Days 1–16 + Unit
            const row1 = [`${row.partyName}-RowSpan_2`];
            for (let i = 1; i <= 16; i++) row1.push(row.quantities[i] || "");
            row1.push("Kg");

            // Row 2 → Days 17–31 + Total
            const row2 = [""];
            for (let i = 17; i <= 31; i++) row2.push(row.quantities[i] || "");
            row2.push(totalQty);
            tableBody.push(row1);
            tableBody.push(row2);
        });

        // ✅ Draw the table
        doc.autoTable({
            head: [headerTop, headerBottom],
            body: tableBody,
            startY: margin + 95,
            theme: "grid",
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 9,
                halign: "center",
                valign: "middle",
                lineWidth: 0.5
            },

            didParseCell: (data1) => {
                if (data1.row.cells[0].raw === "Party-RowSpan_2") {
                    debugger
                    data1.row.cells[0].rowSpan = 2
                }
            },
            headStyles: {
                fillColor: [230, 230, 230],
                textColor: 20,
                fontStyle: "bold",
                lineWidth: 0.7
            },
            columnStyles: {
                0: { cellWidth: 90, halign: "left" },
                17: { cellWidth: 60, halign: "center" } // last column (Unit/Total)
            }
        });
    }

    // 🔹 Footer
    function pageFooter() {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.text(`Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width - margin - 80,
                doc.internal.pageSize.height - margin - 10
            );
        }
    }

    // 🏗️ Build PDF
    drawBorder();
    pageHeader();
    reportBody();
    pageFooter();

    // ✅ Open PDF in a new tab
    const pdfUrl = URL.createObjectURL(doc.output('blob'));
    window.open(pdfUrl);
};

export default PeriodWiseItemSale;
