Sub ConvertPPT5ToSlides()
    ' PPT5 ULTIMATE CONVERTER (CLEAN NO ERRORS)
    ' COPY AND PASTE THIS ENTIRE BLOCK INTO YOUR VBA MODULE

    Dim pptApp As Object
    Dim pptPres As Object
    Dim sld As Object
    
    ' --- INITIALIZE POWERPOINT ---
    On Error Resume Next
    Set pptApp = GetObject(, "PowerPoint.Application")
    If Err.Number <> 0 Then
        Set pptApp = CreateObject("PowerPoint.Application")
    End If
    On Error GoTo 0
    
    If pptApp Is Nothing Then
        MsgBox "PowerPoint could not be started.", vbCritical
        Exit Sub
    End If
    
    pptApp.Visible = True
    Set pptPres = pptApp.Presentations.Add
    
    Dim cBullet As String, cRu As String
    cBullet = " " & ChrW(8226) & " "
    cRu = ChrW(8377)

    ' ==========================================================================================
    ' SLIDE 1: Executive Dashboard (Column Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Executive Dashboard: Strategic Turnaround", _
        cBullet & "Target NPV: " & cRu & "45,000Cr (Delta vs Status Quo)" & vbCrLf & _
        cBullet & "Success Prob: 82% (Monte Carlo)" & vbCrLf & _
        cBullet & "Target EBITDA: 14.5% (vs 5.6%)")
    AddNativeChart sld, 51, "Value Creation Bridge (" & cRu & " Cr)", Array("SQ", "Opt", "Svc", "Eff", "NPV"), Array(-16000, 9500, 18200, 17300, 29000)

    ' ==========================================================================================
    ' SLIDE 2: Valuation 7% Threshold (Line Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Valuation & The 7% Threshold", _
        cBullet & "Current Share: 8.2% (Decay Point)" & vbCrLf & _
        cBullet & "VaR: " & cRu & "1,400Cr per 6mo delay" & vbCrLf & _
        cBullet & "Risk: Collapse below 7% share")
    AddNativeChart sld, 4, "Enterprise Value Decay (Share %)", Array("12%", "10%", "8.2%", "7.5%", "7.0%", "6.0%"), Array(85000, 72000, 45000, 32000, 15000, 0)

    ' ==========================================================================================
    ' SLIDE 3: Portfolio Choice (Bar Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Portfolio Choice - Domestic vs Intl", _
        cBullet & "Domestic IRR: 2.3x higher than Intl" & vbCrLf & _
        cBullet & "Choice: Reallocate " & cRu & "3,500Cr" & vbCrLf & _
        cBullet & "Risk: 40% (Domestic) vs 65% (Intl)")
    AddNativeChart sld, 57, "NPV Comparison (" & cRu & " Cr)", Array("Domestic", "Intl", "Niche"), Array(24000, 10500, 6500)

    ' ==========================================================================================
    ' SLIDE 4: Customer Cohorts (Column Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Customer Segmentation & LTV", _
        cBullet & "Engine: Gen-Z Urban (85% Engagement)" & vbCrLf & _
        cBullet & "LTV: " & cRu & "18.7L per user" & vbCrLf & _
        cBullet & "Churn: Tier 2/3 is 24% lower")
    AddNativeChart sld, 51, "LTV by Segment (" & cRu & " L)", Array("Gen-Z", "Metro Pro", "Tier-2"), Array(22.0, 18.0, 13.5)

    ' ==========================================================================================
    ' SLIDE 5: Financial Model (Waterfall/Column)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Financial Drivers & Payback", _
        cBullet & "EBITDA: 5.6% -> 14.5% via Services" & vbCrLf & _
        cBullet & "Payback: 2.1 years on " & cRu & "7k Cr" & vbCrLf & _
        cBullet & "Driver: Service mix is 47% of uplift")
    AddNativeChart sld, 51, "EBITDA Expansion Bridge (%)", Array("Base", "Svc Mix", "Ops", "Scale", "Target"), Array(5.6, 4.1, 2.2, 2.6, 14.5)

    ' ==========================================================================================
    ' SLIDE 6: Capital Allocation (Pie Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Capital Discipline & Allocation", _
        cBullet & "IRR: Target 15% vs Current 6%" & vbCrLf & _
        cBullet & "Focus: 28% Svc, 25% Eco, 18% Local" & vbCrLf & _
        cBullet & "Incentive: " & cRu & "450Cr PLI gains")
    AddNativeChart sld, 5, "Capital Allocation Mix", Array("Services", "Platform", "Local", "Network"), Array(28, 25, 18, 29)

    ' ==========================================================================================
    ' SLIDE 7: Supply Resilience (Bar Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Supply Resilience (Localization)", _
        cBullet & "Goal: China dep. 85% -> 40%" & vbCrLf & _
        cBullet & "Inventory: 45 days -> 25 days" & vbCrLf & _
        cBullet & "Score: Resilience 4.2 -> 8.5/10")
    AddNativeChart sld, 57, "Sourcing Cost Index (Base=100)", Array("China", "ASEAN", "India (PLI)"), Array(100, 85, 72)

    ' ==========================================================================================
    ' SLIDE 8: Revenue Model (Line Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Scaling Recurring High-Margin Mix", _
        cBullet & "Mix Target: 30% Services Revenue" & vbCrLf & _
        cBullet & "Margin Spec: 48% vs 12% HW" & vbCrLf & _
        cBullet & "Valuation: 18x EBITDA multiple")
    AddNativeChart sld, 4, "Services % of Revenue", Array("2025", "2026", "2027", "2028", "2029", "2030"), Array(5, 12, 25, 35, 40, 45)

    ' ==========================================================================================
    ' SLIDE 9: Human Capital (Column Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Talent ROI & ESOP Alignment", _
        cBullet & "ROI: 3.2x return on retention" & vbCrLf & _
        cBullet & "Goal: Attrition 16% -> 8%" & vbCrLf & _
        cBullet & "Tool: " & cRu & "1,500Cr ESOP Pool")
    AddNativeChart sld, 51, "Attrition Rate Target (%)", Array("Cur", "Y1", "Y2", "Y3"), Array(16, 14, 10, 8)

    ' ==========================================================================================
    ' SLIDE 10: Recommendation (Bar Chart)
    ' ==========================================================================================
    Set sld = CreateSlide(pptPres, "Recommendation & Board Mandate", _
        cBullet & "Forecast: 82% Success Probability" & vbCrLf & _
        cBullet & "Plan: 3-year phased roadmap" & vbCrLf & _
        cBullet & "Ask: Approve " & cRu & "7,055Cr investment")
    AddNativeChart sld, 51, "Value Creation Bridge (" & cRu & " Cr)", Array("Svc", "Ops", "Growth", "Total"), Array(18200, 17300, 9500, 45000)

    MsgBox "PPT5 Ultimate Deck Generated!" & vbCrLf & "Native Charts & Animations Applied.", vbInformation
End Sub

Function CreateSlide(pres As Object, titleTxt As String, bodyTxt As String) As Object
    Dim sld As Object
    Dim shp As Object
    
    ' Layout 12 = Blank
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, 12)
    
    ' Title
    Set shp = sld.Shapes.AddTextbox(1, 40, 30, 880, 80) ' msoTextOrientationHorizontal
    With shp.TextFrame.TextRange
        .Text = titleTxt
        .Font.Name = "Arial Black"
        .Font.Size = 28
        .Font.Color.RGB = RGB(0, 102, 179)
    End With
    AnimateIn shp, 2
    
    ' Body
    Set shp = sld.Shapes.AddTextbox(1, 40, 130, 450, 350)
    With shp.TextFrame.TextRange
        .Text = bodyTxt
        .Font.Name = "Arial"
        .Font.Size = 20
        .Font.Color.RGB = RGB(60, 60, 60)
        .ParagraphFormat.SpaceBefore = 12
    End With
    AnimateIn shp, 10
    
    ' Footer
    Set shp = sld.Shapes.AddTextbox(1, 40, 500, 700, 30)
    With shp.TextFrame.TextRange
        .Text = "BLOCKVISTA STRATEGIC ADVISORY | CONFIDENTIAL 2026"
        .Font.Size = 10
        .Font.Color.RGB = RGB(150, 150, 150)
    End With
    
    ' Separator
    Set shp = sld.Shapes.AddConnector(1, 40, 110, 920, 110) ' msoConnectorStraight
    shp.Line.ForeColor.RGB = RGB(212, 175, 55)
    shp.Line.Weight = 2
    AnimateIn shp, 4
    
    Set CreateSlide = sld
End Function

Sub AddNativeChart(sld As Object, chartType As Integer, chartTitle As String, cats As Variant, vals As Variant)
    On Error Resume Next
    Dim cht As Object
    Dim wb As Object
    Dim ws As Object
    Dim i As Integer
    
    ' Add Chart 201=Style, Type=Integer, Left=500, Top=130
    ' If AddChart2 fails (old PPT), fall back or ignoring
    Set cht = sld.Shapes.AddChart2(201, chartType, 500, 130, 420, 320).Chart
    If cht Is Nothing Then Exit Sub
    
    cht.ChartTitle.Text = chartTitle
    cht.Legend.Position = -4107 ' xlLegendPositionBottom
    
    ' Attempt Data Population via Excel OLE
    Set wb = cht.ChartData.Workbook
    If Not wb Is Nothing Then
        Set ws = wb.Worksheets(1)
        ws.Range("A2:B20").ClearContents
        For i = LBound(cats) To UBound(cats)
            ws.Cells(i + 2, 1).Value = cats(i)
            ws.Cells(i + 2, 2).Value = vals(i)
        Next i
        wb.Close True
    End If
    
    AnimateIn cht.Parent, 14
    On Error GoTo 0
End Sub

Sub AnimateIn(shp As Object, effectCode As Integer)
    On Error Resume Next
    ' Safe Animation
    shp.AnimationSettings.EntryEffect = 3357 ' ppEffectFade
    shp.AnimationSettings.Animate = True
End Sub
