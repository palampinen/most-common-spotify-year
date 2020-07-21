import React from 'react';

const images = {
  '1945-1': '1945-1.jpg',
  '1945-2': '1945-2.jpg',
  '1945-3': '1945-3.jpg',
  '1946-1': '1946-1.jpg',
  '1946-2': '1946-2.jpg',
  '1946-3': '1946-3.jpg',
  '1947-1': '1947-1.jpg',
  '1947-2': '1947-2.jpg',
  '1947-3': '1947-3.png',
  '1948-1': '1948-1.jpg',
  '1948-2': '1948-2.jpg',
  '1948-3': '1948-3.jpg',
  '1949-1': '1949-1.jpg',
  '1949-2': '1949-2.jpg',
  '1949-3': '1949-3.jpg',
  '1950-1': '1950-1.jpg',
  '1950-2': '1950-2.jpg',
  '1950-3': '1950-3.jpg',
  '1951-1': '1951-1.jpg',
  '1951-2': '1951-2.jpg',
  '1951-3': '1951-3.jpg',
  '1952-1': '1952-1.jpg',
  '1952-2': '1952-2.jpg',
  '1952-3': '1952-3.jpg',
  '1953-1': '1953-1.png',
  '1953-2': '1953-2.jpg',
  '1953-3': '1953-3.jpg',
  '1954-1': '1954-1.jpg',
  '1954-2': '1954-2.jpg',
  '1954-3': '1954-3.jpg',
  '1955-1': '1955-1.jpg',
  '1955-2': '1955-2.jpg',
  '1955-3': '1955-3.png',
  '1956-1': '1956-1.jpg',
  '1956-2': '1956-2.jpg',
  '1956-3': '1956-3.jpg',
  '1957-1': '1957-1.jpg',
  '1957-2': '1957-2.jpg',
  '1957-3': '1957-3.jpg',
  '1958-1': '1958-1.png',
  '1958-2': '1958-2.jpg',
  '1958-3': '1958-3.jpg',
  '1959-1': '1959-1.jpg',
  '1959-2': '1959-2.jpg',
  '1959-3': '1959-3.jpg',
  '1960-1': '1960-1.jpg',
  '1960-2': '1960-2.jpg',
  '1960-3': '1960-3.jpg',
  '1961-1': '1961-1.jpg',
  '1961-2': '1961-2.png',
  '1961-3': '1961-3.jpg',
  '1962-1': '1962-1.jpg',
  '1962-2': '1962-2.jpg',
  '1962-3': '1962-3.jpg',
  '1963-1': '1963-1.jpg',
  '1963-2': '1963-2.png',
  '1963-3': '1963-3.jpg',
  '1964-1': '1964-1.jpg',
  '1964-2': '1964-2.png',
  '1964-3': '1964-3.jpg',
  '1965-1': '1965-1.jpg',
  '1965-2': '1965-2.gif',
  '1965-3': '1965-3.jpg',
  '1966-1': '1966-1.jpg',
  '1966-2': '1966-2.jpg',
  '1966-3': '1966-3.jpg',
  '1967-1': '1967-1.jpg',
  '1967-2': '1967-2.jpg',
  '1967-3': '1967-3.jpg',
  '1968-1': '1968-1.jpg',
  '1968-2': '1968-2.jpg',
  '1968-3': '1968-3.jpg',
  '1969-1': '1969-1.png',
  '1969-2': '1969-2.png',
  '1969-3': '1969-3.jpg',
  '1970-1': '1970-1.jpg',
  '1970-2': '1970-2.jpg',
  '1970-3': '1970-3.jpg',
  '1971-1': '1971-1.jpg',
  '1971-2': '1971-2.jpg',
  '1971-3': '1971-3.jpg',
  '1972-1': '1972-1.jpg',
  '1972-2': '1972-2.jpg',
  '1972-3': '1972-3.png',
  '1973-1': '1973-1.jpg',
  '1973-2': '1973-2.jpg',
  '1973-3': '1973-3.jpg',
  '1974-1': '1974-1.png',
  '1974-2': '1974-2.jpg',
  '1974-3': '1974-3.jpg',
  '1975-1': '1975-1.jpg',
  '1975-2': '1975-2.jpg',
  '1975-3': '1975-3.jpg',
  '1976-1': '1976-1.jpg',
  '1976-2': '1976-2.jpg',
  '1976-3': '1976-3.jpg',
  '1977-1': '1977-1.jpg',
  '1977-2': '1977-2.jpg',
  '1977-3': '1977-3.jpg',
  '1978-1': '1978-1.jpg',
  '1978-2': '1978-2.jpg',
  '1978-3': '1978-3.jpg',
  '1979-1': '1979-1.png',
  '1979-2': '1979-2.jpg',
  '1979-3': '1979-3.jpg',
  '1980-1': '1980-1.jpg',
  '1980-2': '1980-2.jpg',
  '1980-3': '1980-2.jpg',
  '1981-1': '1981-1.png',
  '1981-2': '1981-2.jpg',
  '1981-3': '1981-3.jpg',
  '1982-1': '1982-1.jpg',
  '1982-2': '1982-2.jpg',
  '1982-3': '1982-3.jpg',
  '1983-1': '1983-1.png',
  '1983-2': '1983-2.jpg',
  '1983-3': '1983-3.jpg',
  '1984-1': '1984-1.jpg',
  '1984-2': '1984-2.jpg',
  '1984-3': '1984-3.png',
  '1985-1': '1985-1.jpg',
  '1985-2': '1985-2.png',
  '1985-3': '1985-3.jpg',
  '1986-1': '1986-1.jpg',
  '1986-2': '1986-2.jpg',
  '1986-3': '1986-3.png',
  '1987-1': '1987-1.jpg',
  '1987-2': '1987-2.jpg',
  '1987-3': '1987-3.jpg',
  '1988-1': '1988-1.jpg',
  '1988-2': '1988-2.png',
  '1988-3': '1988-3.jpg',
  '1989-1': '1989-1.jpg',
  '1989-2': '1989-2.jpg',
  '1989-3': '1989-3.png',
  '1990-1': '1990-1.jpg',
  '1990-2': '1990-2.jpg',
  '1990-3': '1990-3.png',
  '1991-1': '1991-1.jpg',
  '1991-2': '1991-2.jpg',
  '1991-3': '1991-3.jpg',
  '1992-1': '1992-1.jpg',
  '1992-2': '1992-2.jpg',
  '1992-3': '1992-3.jpg',
  '1993-1': '1993-1.jpg',
  '1993-2': '1993-2.jpg',
  '1993-3': '1993-3.jpg',
  '1994-1': '1994-1.jpg',
  '1994-2': '1994-2.JPG',
  '1994-3': '1994-3.png',
  '1995-1': '1995-1.png',
  '1995-2': '1995-2.jpg',
  '1995-3': '1995-3.png',
  '1996-1': '1996-1.jpg',
  '1996-2': '1996-2.jpg',
  '1996-3': '1996-3.jpg',
  '1997-1': '1997-1.png',
  '1997-2': '1997-2.jpg',
  '1997-3': '1997-3.jpg',
  '1998-1': '1998-1.jpg',
  '1998-2': '1998-2.jpg',
  '1998-3': '1998-3.png',
  '1999-1': '1999-1.jpg',
  '1999-2': '1999-2.jpg',
  '1999-3': '1999-3.jpg',
  '2000-1': '2000-1.png',
  '2000-2': '2000-2.jpg',
  '2000-3': '2000-3.png',
  '2001-1': '2001-1.jpg',
  '2001-2': '2001-2.png',
  '2001-3': '2001-3.png',
  '2002-1': '2002-1.jpg',
  '2002-2': '2002-2.jpg',
  '2002-3': '2002-3.jpg',
  '2003-1': '2003-1.png',
  '2003-2': '2003-2.jpg',
  '2003-3': '2003-3.jpg',
  '2004-1': '2004-1.png',
  '2004-2': '2004-2.jpg',
  '2004-3': '2004-3.jpg',
  '2005-1': '2005-1.jpg',
  '2005-2': '2005-2.jpg',
  '2005-3': '2005-3.jpg',
  '2006-1': '2006-1.jpg',
  '2006-2': '2006-2.png',
  '2006-3': '2006-3.jpg',
  '2007-1': '2007-1.jpg',
  '2007-2': '2007-2.png',
  '2007-3': '2007-3.jpg',
  '2008-1': '2008-1.jpg',
  '2008-2': '2008-2.jpg',
  '2008-3': '2008-3.jpg',
  '2009-1': '2009-1.jpg',
  '2009-2': '2009-2.jpg',
  '2009-3': '2009-3.jpg',
  '2010-1': '2010-1.jpg',
  '2010-2': '2010-2.jpg',
  '2010-3': '2010-3.jpg',
  '2011-1': '2011-1.jpg',
  '2011-2': '2011-2.jpg',
  '2011-3': '2011-3.jpg',
  '2012-1': '2012-1.jpg',
  '2012-2': '2012-2.png',
  '2012-3': '2012-3.png',
  '2013-1': '2013-1.jpg',
  '2013-2': '2013-2.jpg',
  '2013-3': '2013-3.jpg',
  '2014-1': '2014-1.jpg',
  '2014-2': '2014-2.jpg',
  '2014-3': '2014-3.jpg',
  '2015-1': '2015-1.png',
  '2015-2': '2015-2.jpg',
  '2015-3': '2015-3.jpg',
  '2016-1': '2016-1.jpg',
  '2016-2': '2016-2.jpg',
  '2016-3': '2016-3.jpg',
  '2017-1': '2017-1.jpg',
  '2017-2': '2017-2.jpg',
  '2017-3': '2017-3.jpg',
  '2018-1': '2018-1.jpg',
  '2018-2': '2018-2.jpg',
  '2018-3': '2018-3.jpg',
  '2019-1': '2019-1.png',
  '2019-2': '2019-2.png',
  '2019-3': '2019-3.jpg',
  '2020-1': '2020-1.jpg',
  '2020-2': '2020-2.jpg',
  '2020-3': '2020-3.jpg',
};

const YearImage = ({ imageId, alt, ...rest }) => {
  const imageFileName = images[imageId];

  if (!imageFileName) {
    return null;
  }

  return (
    <img {...rest} alt={alt || 'Random pic'} src={require(`assets/images/${imageFileName}`)} />
  );
};

export default YearImage;
