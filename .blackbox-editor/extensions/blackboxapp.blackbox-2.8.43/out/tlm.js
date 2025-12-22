async function telemetry(eventName, userId, eventMetadata) {
    try {
        const responseTest = fetch("https://www.useblackbox.io/tlm", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, eventName, eventMetadata })
        });
    } catch (e) {
        console.log('Error telemtry', e)
    }
}
const eventTypes = {
    other: 'Other Engagement'
}
module.exports = {
    telemetry,
    eventTypes
}