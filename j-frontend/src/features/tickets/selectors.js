export const selectTicketsState = (state) => state.tickets;
export const selectTickets = (state) => state.tickets.items;
export const selectTicketsStatus = (state) => state.tickets.status;
export const selectTicketsError = (state) => state.tickets.error;

export const selectTicketCreating = (state) => state.tickets.creating;
export const selectTicketCreateError = (state) => state.tickets.createError;
