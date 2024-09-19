export const ModalCount = ({ Count }) => {

    return (
        <>
            <div className="d-flex justify-content-between align-items-end">
                <span className="fw-bold ms-auto">Count : {Count}</span>
            </div>
        </>)
}

export const DetailsSection = ({ title, firstLabel, firstValue, secondLabel, secondValue, thirdLabel, thirdValue }) => (
    <>
        <h2 className="text-center">{title}</h2>
        <br />
        <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold me-auto">
                {firstLabel}: <span style={{ color: '#1583cd' }}>{firstValue}</span>
            </span>
            <span className="fw-bold mx-auto">
                {secondLabel}: <span style={{ color: '#1583cd' }}>{secondValue}</span>
            </span>
            <span className="fw-bold ms-auto">
                {thirdLabel}: <span style={{ color: '#1583cd' }}>{thirdValue}</span>
            </span>
        </div>
        <br />
    </>
);
