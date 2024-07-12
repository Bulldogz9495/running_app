import React, { useState, useEffect } from 'react';


export const formatDate = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} @ ${date.toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true})}`
}