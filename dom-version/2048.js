    function lcombine(a,i)
    {
      var len = a[i].length;
       
      for(var j=0;j<len-2;j++) {="" if="" (a[i][j]="=" a[i][j+1])="" a[i][j]="" *="2;" a[i][j+1]="0;" left(a,i);="" break;="" }="" }<="" pre=""><br>
3.显示<p></p>
<p><br>
</p>
<p>显示部分CSS来源 2048源作者程序。</p>
<p>显示代码：</p>
<p><br>
</p>
<p></p><pre class="brush:java;">    function display_div ()
    {
      var i,j;
      var n = "#d";
      for (i = 0 ;i < 4 ;i++)
      {
        for(j=0;j<4;j++)
        {
          if (a[i][j] !=0)
            $(n+(i*4+j)).html("<div class="tile tile-"+a[i][j]+""><div class="tile-inner">"+a[i][j]+"</div></div>");
          else
            $(n+(i*4+j)).html("");
           
           
        }
      }
    }</pre><br>
这段代码是把数组内容显示到  4x4表格内。<p></p>
<p><br>
</p>
<p><br>
</p>
<p>全部代码：http://jsbin.com/biximuho/6/edit</p>
<p><br>
</p>
<p>280多行。</p>                       </len-2;j++)>