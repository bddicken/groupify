
/**
 * Place males into groups.
 * groups: list of groups. Also functions as an outparam.
 * roster: a 2D list of the roster.
 * immovable: true if groups that the females are placed into should be final.
 *            Currently not used and does not actually work!
 */
function place_males(groups, roster, immovable, group_size) {
  roster_copy = roster.slice();
  group_index = 0
  while (roster_copy.length > 0) {
    ri = Math.floor(Math.random() * roster_copy.length);
    if (roster_copy[ri].sex == 'f') { roster_copy.splice(ri, 1); }
    else {
      if (groups[group_index] == undefined) {
        groups[group_index] = [roster_copy[ri]];
      } else {
        groups[group_index].push(roster_copy[ri]);
      }
      if (groups[group_index].length >= group_size) {
        group_index++;
      }
      roster_copy.splice(ri, 1);
    }
  }
}

/**
 * Place females into groups so that at least size/2 females are in each group.
 * groups: list of groups. Also functions as an outparam.
 * roster: a 2D list of the roster.
 * immovable: true if groups that the females are placed into should be final.
 *            Currently not used and does not actually work!
 */
function place_females(groups, roster, immovable, size) {
  // Get the female count
  female_count = 0
  for (i=0; i < roster.length; i++) {
    if (roster[i]['sex'] == 'f') {
      female_count++;
    }
  }

  // This code could probably be written better
  roster_copy = roster.slice();
  ri = Math.floor(Math.random() * groups.length);
  gs = 0;
  for (i=0; i < roster_copy.length;) {
    item = roster_copy[i];
    if (item['sex'] == 'f') {
      if (groups[ri] == undefined) {
        groups[ri] = [];
      }
      groups[ri].push(item);
      female_count--;
      gs++;
      if(gs == size && female_count >= size) {
        ri2 = Math.floor(Math.random() * groups.length);
        while (ri == ri2) {
          ri2 = Math.floor(Math.random() * groups.length);
        }
        ri = ri2
        gs = 0;
      }
      roster_copy.splice(i, 1);
    } else {
      i++;
    }
  }
}

/**
 * Group the students.
 * content: the contents of the roster CSV file.
 */
function begin_grouping(content) {
  content = content.trim();
  parsed_content = Papa.parse(content, {header:true});
  roster = parsed_content.data;
  groups = Array(Math.ceil(roster.length / 4.0));
  place_females(groups, roster, true, 2);
  place_males(groups, roster, true, 4);
  //console.log('-----')
  //console.log(groups)
  var container = d3.select("#groups_div")
    .append("table")
    .selectAll("tr")
      .data(groups).enter()
      .append("tr")
    .selectAll("td")
      .data(function(d) { return d; }).enter()
      .append("td")
      .text(function(d) { return d.name + ' ' + d.attendance; })
      .style('background-color', function(d) {
        if (d.sex == 'm') { return '#AAFFAA'; }
        else { return '#FFFF55';}});
}

/**
 * This function gets called when a roster CSV file is selected by the user.
 * This function will read the file, build a table of the roster, and 
 * call a function to group the students.
 */
function handle_csv_file() {
  file = document.getElementById('file_upload').files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      content = evt.target.result;
      var parsedCSV = d3.csv.parseRows(content);
      console.log(parsedCSV);
      var container = d3.select("#roster_csv_div")
        .append("table")
        .selectAll("tr")
          .data(parsedCSV).enter()
          .append("tr")
        .selectAll("td")
          .data(function(d) { return d; }).enter()
          .append("td")
          .text(function(d) { return d; });
      begin_grouping(content);
    }
    reader.onerror = function (evt) {
      document.getElementById("file_contents").innerHTML = "error reading file";
    }
  }
}

