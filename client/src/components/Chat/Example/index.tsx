import "./example.scss";

export default function Example({
    example,
    runExample,
}: {
    example: string;
    runExample: (example: string) => void;
}) {
    return (
        <div className="example" onClick={() => runExample(example)}>
            {example}
        </div>
    );
}
