import { CSSProperties } from "react";
import { HashLoader } from "react-spinners";

export const Load = () => {
    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    const color = '#0097A7';

    return (
        <HashLoader
            color={color}
            loading={true}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="text-cyan-700"
        />
    )
}

export const LoadPopUp = () => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ transform: "translate(-50%, -50%)", top: "50%", left: "50%" }}
        >
            <Load />
        </div>
    );
};

export const LoadDialog = (props: { isOpen: boolean }) => {
    const { isOpen } = props;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-transparent rounded-lg p-6">
                <LoadPopUp />
            </div>
        </div>
    );
};