import BaseInfo from "./BaseInfo";
import Network from "./Network";

const Connected = () => {
    return (
        <div className="flex items-center gap-4">
            <Network />
            <BaseInfo />
        </div>
    );
};

export default Connected;