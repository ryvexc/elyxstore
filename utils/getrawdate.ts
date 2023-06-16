export default function getRawDate(): string {
	return new Date().toISOString().slice(0, 19).replace("T", " ");
}
